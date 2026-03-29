package com.recipefinder.service;

import com.recipefinder.entity.Ingredient;
import com.recipefinder.entity.Recipe;
import com.recipefinder.repository.IngredientRepository;
import com.recipefinder.repository.RecipeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class RecipeService {

    /** Strictly greater than 50% of required ingredients must be present in the pantry. */
    private static final double MINIMUM_MATCH_RATIO = 0.5;

    private final RecipeRepository recipeRepository;
    private final IngredientRepository ingredientRepository;

    public RecipeService(RecipeRepository recipeRepository, IngredientRepository ingredientRepository) {
        this.recipeRepository = recipeRepository;
        this.ingredientRepository = ingredientRepository;
    }

    /**
     * Suggests recipes by comparing all ingredients currently stored in the database (pantry)
     * to each recipe's required ingredients. Returns recipes where the share of required
     * ingredients that exist in the pantry is <strong>greater than</strong> 50%.
     */
    @Transactional(readOnly = true)
    public List<Recipe> getSuggestedRecipes() {
        Set<Long> availableIngredientIds = ingredientRepository.findAll().stream()
                .map(Ingredient::getId)
                .filter(id -> id != null)
                .collect(Collectors.toSet());

        return recipeRepository.findAllWithIngredients().stream()
                .filter(recipe -> matchesMoreThanHalf(recipe, availableIngredientIds))
                .toList();
    }

    private static boolean matchesMoreThanHalf(Recipe recipe, Set<Long> availableIngredientIds) {
        var required = recipe.getIngredients();
        if (required == null || required.isEmpty()) {
            return false;
        }
        long total = required.size();
        long matched = required.stream()
                .filter(ing -> ing.getId() != null && availableIngredientIds.contains(ing.getId()))
                .count();
        return (double) matched / (double) total > MINIMUM_MATCH_RATIO;
    }
}
