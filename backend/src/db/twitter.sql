-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema twitter
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema twitter
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `twitter` DEFAULT CHARACTER SET latin1 ;
USE `twitter` ;

-- -----------------------------------------------------
-- Table `twitter`.`email_code`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `twitter`.`email_code` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(45) NOT NULL,
  `code` VARCHAR(6) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;


-- -----------------------------------------------------
-- Table `twitter`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `twitter`.`user` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(15) NOT NULL,
  `name` VARCHAR(50) NOT NULL,
  `avatar` VARCHAR(150) NULL DEFAULT 'https://media.idownloadblog.com/wp-content/uploads/2017/03/Twitter-new-2017-avatar-001.png',
  `coverPic` VARCHAR(100) NULL DEFAULT NULL,
  `isVerified` TINYINT(1) NOT NULL DEFAULT '0',
  `bio` VARCHAR(160) CHARACTER SET 'utf8mb4' NULL DEFAULT NULL,
  `location` VARCHAR(50) NULL DEFAULT NULL,
  `website` VARCHAR(100) NULL DEFAULT NULL,
  `birthDate` DATE NULL DEFAULT NULL,
  `joinedDate` DATE NOT NULL,
  `email` VARCHAR(45) NULL DEFAULT NULL,
  `password` VARCHAR(256) NOT NULL,
  `phone` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `username_UNIQUE` (`username` ASC))
ENGINE = InnoDB
AUTO_INCREMENT = 90
DEFAULT CHARACTER SET = latin1;


-- -----------------------------------------------------
-- Table `twitter`.`tweet`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `twitter`.`tweet` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `authorID` INT(11) NOT NULL,
  `text` VARCHAR(280) NOT NULL,
  `isReply` TINYINT(1) NOT NULL,
  `referencedTweetID` INT(11) NULL DEFAULT NULL,
  `views` INT(11) NOT NULL,
  `creationDate` DATETIME NOT NULL,
  `replyDepth` INT(11) NOT NULL,
  `rootTweetID` INT(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_Tweet_Autor_idx` (`authorID` ASC),
  INDEX `fk_Tweet_Reference_idx` (`referencedTweetID` ASC),
  CONSTRAINT `fk_Tweet_Autor`
    FOREIGN KEY (`authorID`)
    REFERENCES `twitter`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Tweet_Reference`
    FOREIGN KEY (`referencedTweetID`)
    REFERENCES `twitter`.`tweet` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 1668
DEFAULT CHARACTER SET = latin1;


-- -----------------------------------------------------
-- Table `twitter`.`tweet_tags_user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `twitter`.`tweet_tags_user` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `tweetID` INT(11) NOT NULL,
  `userID` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC),
  UNIQUE INDEX `user_UNIQUE` (`tweetID` ASC, `userID` ASC),
  INDEX `fk_userID_idx` (`userID` ASC),
  CONSTRAINT `fk_tweetID`
    FOREIGN KEY (`tweetID`)
    REFERENCES `twitter`.`tweet` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_userID`
    FOREIGN KEY (`userID`)
    REFERENCES `twitter`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 3142
DEFAULT CHARACTER SET = latin1;


-- -----------------------------------------------------
-- Table `twitter`.`user_follows`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `twitter`.`user_follows` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `followerID` INT(11) NOT NULL,
  `followeeID` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `unique` (`followerID` ASC, `followeeID` ASC),
  INDEX `fk_User_has_User_User2_idx` (`followeeID` ASC),
  INDEX `fk_User_has_User_User1_idx` (`followerID` ASC),
  CONSTRAINT `fk_User_has_User_User1`
    FOREIGN KEY (`followerID`)
    REFERENCES `twitter`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_User_has_User_User2`
    FOREIGN KEY (`followeeID`)
    REFERENCES `twitter`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 456
DEFAULT CHARACTER SET = latin1;


-- -----------------------------------------------------
-- Table `twitter`.`user_reacts_to_tweet`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `twitter`.`user_reacts_to_tweet` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `userID` INT(11) NOT NULL,
  `tweetID` INT(11) NOT NULL,
  `reactionDate` DATETIME NOT NULL,
  `reaction` ENUM('retweet', 'like') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC),
  INDEX `fk_userID_idx` (`userID` ASC),
  INDEX `fk_tweetID_idx` (`tweetID` ASC),
  UNIQUE INDEX `reaction_UNIQUE` (`userID` ASC, `tweetID` ASC, `reaction` ASC),
  CONSTRAINT `fk_retweet_tweetID`
    FOREIGN KEY (`tweetID`)
    REFERENCES `twitter`.`tweet` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_retweet_userID`
    FOREIGN KEY (`userID`)
    REFERENCES `twitter`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 2435
DEFAULT CHARACTER SET = latin1;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
