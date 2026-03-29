package com.recipefinder.service;

import com.recipefinder.entity.Ingredient;
import com.recipefinder.entity.Recipe;
import com.recipefinder.repository.RecipeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class PantryService {

    private static final double MINIMUM_MATCH_RATIO = 0.7;

    private final RecipeRepository recipeRepository;

    public PantryService(RecipeRepository recipeRepository) {
        this.recipeRepository = recipeRepository;
    }

    /**
     * Returns recipes for which the user owns at least 70% of the required ingredients
     * (by count of distinct required items present in {@code inventoryIds}).
     */
    @Transactional(readOnly = true)
    public List<Recipe> findRecipesByAvailableIngredients(List<Long> inventoryIds) {
        Set<Long> owned = new HashSet<>(inventoryIds);
        return recipeRepository.findAll().stream()
                .filter(recipe -> matchesAvailability(recipe, owned))
                .toList();
    }

    private static boolean matchesAvailability(Recipe recipe, Set<Long> ownedIngredientIds) {
        Set<Ingredient> required = recipe.getIngredients();
        if (required == null || required.isEmpty()) {
            return false;
        }
        long total = required.size();
        long matched = required.stream()
                .filter(ing -> ing.getId() != null && ownedIngredientIds.contains(ing.getId()))
                .count();
        return (double) matched / (double) total >= MINIMUM_MATCH_RATIO;
    }
}
