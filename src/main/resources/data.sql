-- Sample ingredients (Refrigerated, Frozen, Dry Storage)
INSERT INTO ingredients (id, name, category, quantity, unit, expiry_date) VALUES
(1, 'Whole milk', 'FRIDGE', 1.0, 'L', '2026-04-15'),
(2, 'Eggs', 'FRIDGE', 12.0, 'each', '2026-04-10'),
(3, 'All-purpose flour', 'DRY', 2.0, 'kg', NULL),
(4, 'Butter', 'FRIDGE', 250.0, 'g', '2026-05-01'),
(5, 'Frozen peas', 'FREEZER', 500.0, 'g', '2026-12-31');

INSERT INTO recipes (id, name) VALUES
(1, 'Buttermilk pancakes'),
(2, 'Scrambled eggs with butter');

-- Recipe 1: flour, eggs, milk (3 ingredients)
INSERT INTO recipe_ingredient (recipe_id, ingredient_id) VALUES
(1, 3),
(1, 2),
(1, 1);

-- Recipe 2: eggs, butter, milk (3 ingredients)
INSERT INTO recipe_ingredient (recipe_id, ingredient_id) VALUES
(2, 2),
(2, 4),
(2, 1);
