import * as migration_20261109_151520_initial from './20261109_151520_initial';
import * as migration_20261110_012749_reference_design from './20261110_012749_reference_design';

export const migrations = [
  {
    up: migration_20261109_151520_initial.up,
    down: migration_20261109_151520_initial.down,
    name: '20261109_151520_initial',
  },
  {
    up: migration_20261110_012749_reference_design.up,
    down: migration_20261110_012749_reference_design.down,
    name: '20261110_012749_reference_design'
  },
];
