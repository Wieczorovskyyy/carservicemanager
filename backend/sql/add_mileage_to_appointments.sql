ALTER TABLE `appointments`
  ADD COLUMN IF NOT EXISTS `mileage` INT UNSIGNED NULL AFTER `car_model`;
