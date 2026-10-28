import * as migration_20261023_212246_initial from './20261023_212246_initial';
import * as migration_20261026_140124_add_apartment_type from './20261026_140124_add_apartment_type';
import * as migration_20261026_150751_add_monthly_charges from './20261026_150751_add_monthly_charges';
import * as migration_20261026_152652_add_other_site_links from './20261026_152652_add_other_site_links';
import * as migration_20261026_154901_remove_site_level_links from './20261026_154901_remove_site_level_links';
import * as migration_20261026_221056_add_buildings from './20261026_221056_add_buildings';
import * as migration_20261027_200500_enable_rls from './20261027_200500_enable_rls';

export const migrations = [
  {
    up: migration_20261023_212246_initial.up,
    down: migration_20261023_212246_initial.down,
    name: '20261023_212246_initial',
  },
  {
    up: migration_20261026_140124_add_apartment_type.up,
    down: migration_20261026_140124_add_apartment_type.down,
    name: '20261026_140124_add_apartment_type',
  },
  {
    up: migration_20261026_150751_add_monthly_charges.up,
    down: migration_20261026_150751_add_monthly_charges.down,
    name: '20261026_150751_add_monthly_charges',
  },
  {
    up: migration_20261026_152652_add_other_site_links.up,
    down: migration_20261026_152652_add_other_site_links.down,
    name: '20261026_152652_add_other_site_links',
  },
  {
    up: migration_20261026_154901_remove_site_level_links.up,
    down: migration_20261026_154901_remove_site_level_links.down,
    name: '20261026_154901_remove_site_level_links',
  },
  {
    up: migration_20261026_221056_add_buildings.up,
    down: migration_20261026_221056_add_buildings.down,
    name: '20261026_221056_add_buildings'
  },
  {
    up: migration_20261027_200500_enable_rls.up,
    down: migration_20261027_200500_enable_rls.down,
    name: '20261027_200500_enable_rls',
  },
];
