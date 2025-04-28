-- Create Database
CREATE DATABASE IF NOT EXISTS historical_simulation;
USE historical_simulation;

-- 1. Users
CREATE TABLE IF NOT EXISTS Users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Scenarios
CREATE TABLE IF NOT EXISTS Scenarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  introduction TEXT NOT NULL,
  summary_template TEXT NULL,
  historical_outcome TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 3. Decision Points
CREATE TABLE IF NOT EXISTS DecisionPoints (
  id INT AUTO_INCREMENT PRIMARY KEY,
  scenario_id INT NOT NULL,
  question TEXT NOT NULL,
  position INT NOT NULL,
  INDEX idx_dp_scenario (scenario_id),
  CONSTRAINT fk_dp_scenario
    FOREIGN KEY (scenario_id)
    REFERENCES Scenarios(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. Options
CREATE TABLE IF NOT EXISTS Options (
  id INT AUTO_INCREMENT PRIMARY KEY,
  decision_point_id INT NOT NULL,
  text VARCHAR(255) NOT NULL,
  impact_treasury INT NOT NULL,
  impact_military INT NOT NULL,
  impact_stability INT NOT NULL,
  feedback TEXT NOT NULL,
  next_point_id INT NULL,
  INDEX idx_opt_dp (decision_point_id),
  INDEX idx_opt_next (next_point_id),
  CONSTRAINT fk_opt_dp
    FOREIGN KEY (decision_point_id)
    REFERENCES DecisionPoints(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_opt_next
    FOREIGN KEY (next_point_id)
    REFERENCES DecisionPoints(id)
    ON DELETE SET NULL
) ENGINE=InnoDB;

-- 5. Game Sessions
CREATE TABLE IF NOT EXISTS GameSessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  scenario_id INT NOT NULL,
  current_point_id INT NOT NULL,
  treasury INT NOT NULL DEFAULT 100,
  military INT NOT NULL DEFAULT 100,
  stability INT NOT NULL DEFAULT 100,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_gs_user (user_id),
  INDEX idx_gs_scenario (scenario_id),
  INDEX idx_gs_point (current_point_id),
  CONSTRAINT fk_gs_user
    FOREIGN KEY (user_id)
    REFERENCES Users(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_gs_scenario
    FOREIGN KEY (scenario_id)
    REFERENCES Scenarios(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_gs_point
    FOREIGN KEY (current_point_id)
    REFERENCES DecisionPoints(id)
    ON DELETE SET NULL
) ENGINE=InnoDB;

-- 6. Decision History
CREATE TABLE IF NOT EXISTS DecisionHistory (
  id INT AUTO_INCREMENT PRIMARY KEY,
  session_id INT NOT NULL,
  decision_point_id INT NOT NULL,
  option_id INT NOT NULL,
  treasury_after INT NOT NULL,
  military_after INT NOT NULL,
  stability_after INT NOT NULL,
  occurred_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_dh_session (session_id),
  INDEX idx_dh_dp (decision_point_id),
  INDEX idx_dh_opt (option_id),
  CONSTRAINT fk_dh_session
    FOREIGN KEY (session_id)
    REFERENCES GameSessions(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_dh_dp
    FOREIGN KEY (decision_point_id)
    REFERENCES DecisionPoints(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_dh_opt
    FOREIGN KEY (option_id)
    REFERENCES Options(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

SELECT * FROM Scenarios;
SELECT * FROM Users;