-- Pantry: Fridge (FRIDGE), Freezer (FREEZER), Dry storage (DRY)
INSERT INTO ingredients (id, name, category, quantity, unit, expiry_date) VALUES
(1, 'Whole milk', 'FRIDGE', 1.0, 'L', '2026-04-15'),
(2, 'Eggs', 'FRIDGE', 12.0, 'each', '2026-04-10'),
(3, 'All-purpose flour', 'DRY', 2.0, 'kg', NULL),
(4, 'Butter', 'FRIDGE', 250.0, 'g', '2026-05-01'),
(5, 'Frozen peas', 'FREEZER', 500.0, 'g', '2026-12-31'),
(6, 'Greek yogurt', 'FRIDGE', 4.0, 'cups', '2026-04-02'),
(7, 'Cheddar cheese', 'FRIDGE', 400.0, 'g', '2026-04-20'),
(8, 'Vanilla ice cream', 'FREEZER', 1.0, 'L', '2026-08-01'),
(9, 'Frozen mixed berries', 'FREEZER', 400.0, 'g', '2027-01-15'),
(10, 'Basmati rice', 'DRY', 1.5, 'kg', NULL),
(11, 'Spaghetti', 'DRY', 500.0, 'g', NULL),
(12, 'Olive oil', 'DRY', 750.0, 'ml', '2026-11-30');

INSERT INTO recipes (id, name) VALUES
(1, 'Buttermilk pancakes'),
(2, 'Scrambled eggs with butter');

INSERT INTO recipe_ingredient (recipe_id, ingredient_id) VALUES
(1, 3),
(1, 2),
(1, 1);

INSERT INTO recipe_ingredient (recipe_id, ingredient_id) VALUES
(2, 2),
(2, 4),
(2, 1);
