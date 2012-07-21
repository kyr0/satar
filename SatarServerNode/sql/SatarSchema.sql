/* Create schema if not existing */
CREATE SCHEMA IF NOT EXISTS `SATAR` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ;
USE `SATAR`;

/* Create node event table */
CREATE  TABLE `SATAR`.`node_event` (
  `id` BIGINT NOT NULL AUTO_INCREMENT ,
  `timestamp` BIGINT NOT NULL DEFAULT 0 ,
  `reset_timestamp_ms` BIGINT NOT NULL ,
  `type` TINYINT NOT NULL ,
  `participant_id` BIGINT NOT NULL ,
  `node_id` BIGINT NOT NULL ,
  `timeelapsed_startfinish` BIGINT NOT NULL DEFAULT 0 ,
  PRIMARY KEY (`id`) )
ENGINE = MyISAM
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_general_ci
COMMENT = 'Stores node events delivered by the hardware controller.';

/* Create race table */
CREATE  TABLE `SATAR`.`race` (
  `id` BIGINT NOT NULL AUTO_INCREMENT ,
  `name` TEXT NOT NULL ,
  `starttime` BIGINT NOT NULL DEFAULT 0,
  `finishtime` BIGINT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`) )
ENGINE = MyISAM
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_general_ci
COMMENT = 'Stores races.';

/* Create node event to race relation table */
CREATE  TABLE `SATAR`.`node_event_to_race` (
  `id` BIGINT NOT NULL AUTO_INCREMENT ,
  `race_id` BIGINT NOT NULL,
  `node_event_id` BIGINT NOT NULL,
  PRIMARY KEY (`id`) )
ENGINE = MyISAM
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_general_ci
COMMENT = 'Stores node event to race relations.';

/* Add indices */
ALTER TABLE `SATAR`.`node_event`
ADD INDEX `paricipant_id` USING BTREE (`participant_id` ASC),
ADD INDEX `type` USING BTREE (`type` ASC);
