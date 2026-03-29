package com.recipefinder.service;

import com.recipefinder.entity.Recipe;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class RecipeServiceTest {

    @Autowired
    private RecipeService recipeService;

    @Test
    void getSuggestedRecipes_includesRecipesWhenMoreThanHalfOfIngredientsInPantry() {
        // Seed pantry has all ingredients 1–12; both sample recipes need 3/3 from that set → 100% > 50%
        List<Recipe> suggested = recipeService.getSuggestedRecipes();
        assertThat(suggested)
                .extracting(Recipe::getId)
                .contains(1L, 2L);
    }
}
