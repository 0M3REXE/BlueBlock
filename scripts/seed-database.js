import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials. Check your .env.local file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedDatabase() {
  console.log('🌱 Starting database seeding...\n');

  try {
    // 1. Seed Organizations
    console.log('📦 Seeding organizations...');
    const { data: orgs, error: orgError } = await supabase
      .from('organizations')
      .upsert([
        {
          name: 'Tamil Nadu Coastal Restoration',
          description: 'Non-profit focused on mangrove restoration along the Tamil Nadu coast',
          contact_email: 'info@tncoastal.org',
        },
        {
          name: 'Kerala Blue Carbon Initiative',
          description: 'Government-backed program for blue carbon ecosystem restoration',
          contact_email: 'contact@keralabc.gov.in',
        },
      ], { onConflict: 'name', ignoreDuplicates: true })
      .select();

    if (orgError) throw orgError;
    console.log(`✓ Created ${orgs?.length || 0} organizations`);

    const org1 = orgs?.[0];
    const org2 = orgs?.[1];

    // 2. Seed Projects
    console.log('\n📦 Seeding projects...');
    const { data: projects, error: projectError } = await supabase
      .from('projects')
      .upsert([
        {
          organization_id: org1?.id,
          name: 'Pichavaram Mangrove Restoration 2024',
          description: 'Large-scale mangrove restoration in Pichavaram wetlands',
          total_area_hectares: 250.5,
          baseline_carbon_tons: 1200,
          estimated_sequestration_tons: 3500,
          start_date: '2024-01-15',
          restoration_method: 'Direct planting',
        },
        {
          organization_id: org2?.id,
          name: 'Vembanad Lake Seagrass Restoration',
          description: 'Seagrass meadow restoration in Vembanad Lake',
          total_area_hectares: 180.0,
          baseline_carbon_tons: 800,
          estimated_sequestration_tons: 2200,
          start_date: '2024-03-01',
          restoration_method: 'Transplantation',
        },
      ], { onConflict: 'name', ignoreDuplicates: true })
      .select();

    if (projectError) throw projectError;
    console.log(`✓ Created ${projects?.length || 0} projects`);

    const project1 = projects?.[0];
    const project2 = projects?.[1];

    // 3. Seed Sites
    console.log('\n📦 Seeding sites...');
    const { data: sites, error: siteError } = await supabase
      .from('sites')
      .upsert([
        {
          project_id: project1?.id,
          name: 'Pichavaram North Zone',
          location_name: 'Pichavaram, Tamil Nadu',
          area_hectares: 75.2,
          centroid_lat: 11.4304,
          centroid_lon: 79.7755,
          habitat_type: 'Mangrove Forest',
        },
        {
          project_id: project1?.id,
          name: 'Pichavaram South Zone',
          location_name: 'Pichavaram, Tamil Nadu',
          area_hectares: 82.5,
          centroid_lat: 11.4150,
          centroid_lon: 79.7850,
          habitat_type: 'Mangrove Forest',
        },
        {
          project_id: project2?.id,
          name: 'Vembanad East Meadow',
          location_name: 'Vembanad Lake, Kerala',
          area_hectares: 60.0,
          centroid_lat: 9.6413,
          centroid_lon: 76.3935,
          habitat_type: 'Seagrass Meadow',
        },
      ], { onConflict: 'name', ignoreDuplicates: true })
      .select();

    if (siteError) throw siteError;
    console.log(`✓ Created ${sites?.length || 0} sites`);

    const site1 = sites?.[0];
    const site2 = sites?.[1];
    // const site3 = sites?.[2]; // Reserved for future use

    // 4. Seed Species
    console.log('\n📦 Seeding species...');
    const { data: species, error: speciesError } = await supabase
      .from('species')
      .upsert([
        {
          common_name: 'Red Mangrove',
          scientific_name: 'Rhizophora mangle',
          carbon_sequestration_rate: 2.5,
        },
        {
          common_name: 'Black Mangrove',
          scientific_name: 'Avicennia germinans',
          carbon_sequestration_rate: 2.2,
        },
        {
          common_name: 'Eelgrass',
          scientific_name: 'Zostera marina',
          carbon_sequestration_rate: 1.8,
        },
      ], { onConflict: 'scientific_name', ignoreDuplicates: true })
      .select();

    if (speciesError) throw speciesError;
    console.log(`✓ Created ${species?.length || 0} species`);

    const species1 = species?.[0];
    const species2 = species?.[1];

    // 5. Seed Contacts (Field Workers)
    console.log('\n📦 Seeding contacts...');
    const { data: contacts, error: contactError } = await supabase
      .from('contacts')
      .upsert([
        {
          organization_id: org1?.id,
          full_name: 'Rajesh Kumar',
          email: 'rajesh.kumar@tncoastal.org',
          phone: '+91-9876543210',
          role: 'Field Supervisor',
        },
        {
          organization_id: org1?.id,
          full_name: 'Priya Sharma',
          email: 'priya.sharma@tncoastal.org',
          phone: '+91-9876543211',
          role: 'Field Worker',
        },
        {
          organization_id: org2?.id,
          full_name: 'Arun Nair',
          email: 'arun.nair@keralabc.gov.in',
          phone: '+91-9876543212',
          role: 'Field Worker',
        },
      ], { onConflict: 'email', ignoreDuplicates: true })
      .select();

    if (contactError) throw contactError;
    console.log(`✓ Created ${contacts?.length || 0} contacts`);

    const contact1 = contacts?.[0];
    const contact2 = contacts?.[1];

    // 6. Assign Field Members to Sites
    console.log('\n📦 Assigning field members to sites...');
    const { data: assignments, error: assignmentError } = await supabase
      .from('site_field_members')
      .upsert([
        {
          site_id: site1?.id,
          contact_id: contact1?.id,
          role: 'Supervisor',
        },
        {
          site_id: site1?.id,
          contact_id: contact2?.id,
          role: 'Field Worker',
        },
        {
          site_id: site2?.id,
          contact_id: contact2?.id,
          role: 'Field Worker',
        },
      ], { onConflict: 'site_id,contact_id', ignoreDuplicates: true })
      .select();

    if (assignmentError) throw assignmentError;
    console.log(`✓ Created ${assignments?.length || 0} field member assignments`);

    // 7. Seed Planting Batches
    console.log('\n📦 Seeding planting batches...');
    const { data: batches, error: batchError } = await supabase
      .from('planting_batches')
      .upsert([
        {
          site_id: site1?.id,
          batch_code: 'PNZ-2024-01',
          planting_start: '2024-02-01',
          planting_end: '2024-02-15',
          source_nursery: 'Tamil Nadu Forest Department Nursery',
        },
        {
          site_id: site2?.id,
          batch_code: 'PSZ-2024-01',
          planting_start: '2024-02-10',
          planting_end: '2024-02-25',
          source_nursery: 'Tamil Nadu Forest Department Nursery',
        },
      ], { onConflict: 'batch_code', ignoreDuplicates: true })
      .select();

    if (batchError) throw batchError;
    console.log(`✓ Created ${batches?.length || 0} planting batches`);

    const batch1 = batches?.[0];
    const batch2 = batches?.[1];

    // 8. Link Species to Batches
    console.log('\n📦 Linking species to planting batches...');
    const { error: batchSpeciesError } = await supabase
      .from('planting_batch_species')
      .upsert([
        {
          planting_batch_id: batch1?.id,
          species_id: species1?.id,
          saplings_planted: 5000,
        },
        {
          planting_batch_id: batch1?.id,
          species_id: species2?.id,
          saplings_planted: 3000,
        },
        {
          planting_batch_id: batch2?.id,
          species_id: species1?.id,
          saplings_planted: 4500,
        },
      ], { onConflict: 'planting_batch_id,species_id', ignoreDuplicates: true });

    if (batchSpeciesError) throw batchSpeciesError;
    console.log('✓ Linked species to planting batches');

    // 9. Seed Measurements
    console.log('\n📦 Seeding measurements...');
    const { data: measurements, error: measurementError } = await supabase
      .from('measurements')
      .insert([
        {
          site_id: site1?.id,
          planting_batch_id: batch1?.id,
          measurement_date: '2024-04-01',
          avg_height_cm: 45.2,
          survival_rate_percent: 92.5,
          canopy_cover_percent: 35.0,
          notes: 'Strong growth, minimal mortality',
        },
        {
          site_id: site1?.id,
          planting_batch_id: batch1?.id,
          measurement_date: '2024-06-01',
          avg_height_cm: 68.5,
          survival_rate_percent: 90.1,
          canopy_cover_percent: 48.0,
          notes: 'Continued healthy growth',
        },
        {
          site_id: site2?.id,
          planting_batch_id: batch2?.id,
          measurement_date: '2024-05-01',
          avg_height_cm: 52.0,
          survival_rate_percent: 88.3,
          canopy_cover_percent: 40.0,
        },
      ])
      .select();

    if (measurementError) throw measurementError;
    console.log(`✓ Created ${measurements?.length || 0} measurements`);

    console.log('\n✅ Database seeding completed successfully!\n');
    console.log('Summary:');
    console.log(`  • ${orgs?.length || 0} Organizations`);
    console.log(`  • ${projects?.length || 0} Projects`);
    console.log(`  • ${sites?.length || 0} Sites`);
    console.log(`  • ${species?.length || 0} Species`);
    console.log(`  • ${contacts?.length || 0} Contacts`);
    console.log(`  • ${batches?.length || 0} Planting Batches`);
    console.log(`  • ${measurements?.length || 0} Measurements`);

  } catch (error) {
    console.error('\n❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();
