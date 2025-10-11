-- ===============================================================
-- Seed Script for mes_core Lookups
--
-- Author(s):
-- -- Dylan DuFresne
-- ===============================================================

SET search_path TO mes_core;

-- ===============================================================
-- Insert: Asset Types
-- ===============================================================

INSERT INTO asset_type (asset_type_name, asset_type_description) VALUES
    ('Functional Location', 'Logical location or area within the facility'),
    ('Asset',              'Physical equipment or machine'),
    ('Item',               'Individual component or part');

-- ===============================================================
-- Insert: Assets (Topic Hierarchy)
-- ===============================================================

-- Enterprise Level
INSERT INTO asset_definition (asset_id, asset_name, asset_description, asset_type_id, parent_asset_id)
SELECT 1, 'Abelara', 'Abelara Manufacturing Enterprise', at.asset_type_id, NULL
FROM asset_type at WHERE at.asset_type_name = 'Functional Location';

-- Site Level
INSERT INTO asset_definition (asset_id, asset_name, asset_description, asset_type_id, parent_asset_id)
SELECT 10, 'Plant 1', 'Primary manufacturing facility', at.asset_type_id, 1
FROM asset_type at WHERE at.asset_type_name = 'Functional Location';

-- Area Level
INSERT INTO asset_definition (asset_id, asset_name, asset_description, asset_type_id, parent_asset_id)
SELECT 20, 'Utilities', 'Plant utilities and support systems', at.asset_type_id, 10
FROM asset_type at WHERE at.asset_type_name = 'Functional Location';

-- System Level
INSERT INTO asset_definition (asset_id, asset_name, asset_description, asset_type_id, parent_asset_id)
SELECT 30, 'Water System', 'Process water and cooling system', at.asset_type_id, 20
FROM asset_type at WHERE at.asset_type_name = 'Functional Location';

-- Equipment Group Level
INSERT INTO asset_definition (asset_id, asset_name, asset_description, asset_type_id, parent_asset_id)
SELECT 22, 'Pump Station 1', 'Primary water pump station', at.asset_type_id, 30
FROM asset_type at WHERE at.asset_type_name = 'Asset';

-- Individual Asset Level
INSERT INTO asset_definition (asset_id, asset_name, asset_description, asset_type_id, parent_asset_id)
SELECT 101, 'Pump-101', 'Centrifugal water pump for cooling system', at.asset_type_id, 22
FROM asset_type at WHERE at.asset_type_name = 'Item';

-- ===============================================================
-- Insert: State Types
-- ===============================================================

INSERT INTO state_type (state_type_name, state_type_color, state_type_description) VALUES
    ('Running',   '#00CC66', 'Asset is actively running'),
    ('Idle',      '#CCCCCC', 'Asset is idle but not in error'),
    ('Down',      '#FF3333', 'Asset is down due to error or planned stop'),
    ('Blocked',   '#FF9900', 'Asset is blocked by downstream dependency'),
    ('Starved',   '#FFCC00', 'Asset is waiting for upstream input'),
    ('Starting',  '#FFFF00', 'Equipment startup sequence'),
    ('Stopping',  '#FF6600', 'Equipment shutdown sequence'),
    ('Maintenance', '#9933FF', 'Equipment under maintenance'),
    ('Fault',     '#FF0000', 'Equipment fault condition');

-- ===============================================================
-- Insert: State Definitions
-- ===============================================================

INSERT INTO state_definition (state_type_id, state_name, state_color, state_description)
SELECT st.state_type_id, s.state_name, s.state_color, s.state_description
FROM (
    VALUES
        ('Running',  'Running',  '#00CC66', 'Asset is actively producing'),
        ('Idle',     'Idle',     '#CCCCCC', 'Asset is idle and not producing'),
        ('Down',     'Down',     '#FF3333', 'Asset is down or stopped'),
        ('Blocked',  'Blocked',  '#FF9900', 'Asset is blocked by downstream equipment'),
        ('Starved',  'Starved',  '#FFCC00', 'Asset is waiting for upstream material'),
        ('Starting', 'Starting', '#FFFF00', 'Equipment startup sequence'),
        ('Stopping', 'Stopping', '#FF6600', 'Equipment shutdown sequence'),
        ('Maintenance', 'Maintenance', '#9933FF', 'Equipment under maintenance'),
        ('Fault',    'Fault',    '#FF0000', 'Equipment fault condition')
) AS s(state_type_name, state_name, state_color, state_description)
JOIN state_type st ON st.state_type_name = s.state_type_name;

-- ===============================================================
-- Insert: Downtime Reasons
-- ===============================================================

INSERT INTO downtime_reason (downtime_reason_code, downtime_reason_name, downtime_reason_description, is_planned) VALUES
-- Planned Downtime
    ('PM',        'Planned Maintenance',       'Scheduled maintenance work', TRUE),
    ('CLEAN',     'Cleaning / Sanitation',     'Cleaning of equipment or lines', TRUE),
    ('CHANGEOVR', 'Product Changeover',        'Swapping products or SKUs', TRUE),
    ('BREAK',     'Operator Break',            'Scheduled break or lunch', TRUE),
    ('MEETING',   'Team Meeting',               'Production/shift meeting', TRUE),
    ('TRAINING',  'Operator Training',         'Scheduled training event', TRUE),
-- Unplanned - Mechanical
    ('E_STOP',    'Emergency Stop',            'Emergency stop engaged', FALSE),
    ('JAM',       'Product Jam',               'Product blockage or jam', FALSE),
    ('FAIL_MECH', 'Mechanical Failure',        'Unexpected mechanical failure', FALSE),
    ('LUBRICATE', 'Lubrication Needed',        'Insufficient lubrication', FALSE),
-- Unplanned - Electrical / Instrumentation
    ('FAIL_CTRL', 'Control System Fault',      'PLC or control panel fault', FALSE),
    ('SENSOR',    'Sensor Fault',               'Sensor failure or misread', FALSE),
    ('DRIVE',     'Drive Fault',                'Motor drive fault', FALSE),
    ('POWER',     'Power Loss',                 'Unexpected loss of power', FALSE),
-- Unplanned - Material Related
    ('NO_MAT',    'Material Shortage',          'Upstream material unavailable', FALSE),
    ('WRONG_MAT', 'Incorrect Material',         'Incorrect material present', FALSE),
    ('NO_LBL',    'Label Shortage',              'Label feed error or shortage', FALSE),
    ('NO_PKG',    'Packaging Shortage',          'Packaging not available', FALSE),
-- Unplanned - Operational
    ('NO_OP',     'No Operator',                 'Operator not present', FALSE),
    ('SETUP_ERR', 'Improper Setup',              'Configuration error', FALSE),
    ('MISALIGN',  'Misalignment',                'Equipment alignment error', FALSE),
    ('QA_HOLD',   'Quality Hold',                 'Awaiting QA approval', FALSE);

-- ===============================================================
-- Insert: Count Types
-- ===============================================================

INSERT INTO count_type (count_type_name, count_type_description, count_type_unit) VALUES
    ('Infeed',   'Raw materials or upstream units fed into the process', 'units'),
    ('Outfeed',  'Finished units or good output', 'units'),
    ('Waste',    'Scrapped or rejected material', 'units'),
    ('General',  'Uncategorized or manually logged count', 'units'),
    ('Gallons Delivered', 'Total gallons delivered to cooling system', 'gallons'),
    ('Water Delivered', 'Total water delivered to cooling system', 'm³'),
    ('Runtime Hours', 'Total pump runtime hours', 'hours'),
    ('Starts', 'Number of equipment starts', 'count'),
    ('Energy Consumed', 'Total energy consumption', 'kWh');

-- ===============================================================
-- Insert: Measurement Types
-- ===============================================================

INSERT INTO measurement_type (measurement_type_name, measurement_type_description, measurement_type_unit) VALUES
    ('Weight',      'Weight measurement in specified units', 'kg'),
    ('Viscosity',   'Viscosity measurement', 'cP'),
    ('Temperature', 'Temperature reading', 'C'),
    ('pH',          'Acidity measurement', 'pH'),
    ('Bearing Temperature', 'Precision bearing temperature measurement', 'C'),
    ('Vibration Analysis', 'Precision vibration measurement', 'mm/s'),
    ('Pressure', 'Pressure readings from process equipment', 'bar'),
    ('Flow', 'Flow rate readings from process equipment', 'm³/h');

-- ===============================================================
-- Insert: KPI Definitions
-- ===============================================================

INSERT INTO kpi_definition (kpi_name, kpi_description, kpi_unit) VALUES
    ('OEE',          'Overall Equipment Effectiveness',              '%'),
    ('Availability', 'Percentage of planned time asset is running', '%'),
    ('Performance',  'Speed compared to ideal cycle time',           '%'),
    ('Quality',      'Good product as percentage of total',          '%'),
    ('ScrapRate',    'Percentage of scrap over total output',        '%'),
    ('Pump Efficiency', 'Overall pump efficiency', '%'),
    ('Energy Efficiency', 'Energy efficiency ratio', 'kWh/m³');

-- ===============================================================
-- Insert: Product Families
-- ===============================================================

INSERT INTO product_family (product_family_name, product_family_description) VALUES
    ('Utilities', 'Utility products and services');

-- ===============================================================
-- Insert: Products
-- ===============================================================

INSERT INTO product_definition (product_name, product_description, product_family_id, ideal_cycle_time, tolerance, unit_of_measure) VALUES
    ('Cooling Water', 'Process cooling water for heat exchange systems', 
     (SELECT product_family_id FROM product_family WHERE product_family_name = 'Utilities'), 
     3600, 0.05, 'm³/h');

SET search_path TO public;
