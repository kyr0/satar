/* Create schema if not existing */
CREATE SCHEMA IF NOT EXISTS `SATARUSER` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ;
USE `SATARUSER`;

/* Create node event table */
CREATE  TABLE `SATARUSER`.`users` (
  `id` BIGINT NOT NULL AUTO_INCREMENT ,
  `participant_id` BIGINT NOT NULL,
  `firstname` TEXT NOT NULL ,
  `lastname` TEXT NOT NULL ,
  PRIMARY KEY (`id`) )
ENGINE = MyISAM
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_general_ci
COMMENT = 'Stores user data for SATAR. (demo schema)';