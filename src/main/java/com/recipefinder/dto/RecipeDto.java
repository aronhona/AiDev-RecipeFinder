package com.recipefinder.dto;

import com.recipefinder.entity.Ingredient;
import com.recipefinder.entity.Recipe;

import java.util.List;

public record RecipeDto(Long id, String name, List<String> requiredIngredientNames) {

    public static RecipeDto fromEntity(Recipe recipe) {
        List<String> names = recipe.getIngredients().stream()
                .map(Ingredient::getName)
                .sorted()
                .toList();
        return new RecipeDto(recipe.getId(), recipe.getName(), names);
    }
}
