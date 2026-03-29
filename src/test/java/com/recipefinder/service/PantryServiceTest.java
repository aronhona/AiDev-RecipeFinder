package com.recipefinder.service;

import com.recipefinder.entity.Recipe;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class PantryServiceTest {

    @Autowired
    private PantryService pantryService;

    @Test
    void findRecipesByAvailableIngredients_requiresAtLeastSeventyPercent() {
        // Seed: Recipe 1 needs ingredients 1,2,3 — 2 of 3 ≈ 66% → excluded
        assertThat(pantryService.findRecipesByAvailableIngredients(List.of(1L, 2L)))
                .extracting(Recipe::getId)
                .doesNotContain(1L);

        // All three → 100%
        assertThat(pantryService.findRecipesByAvailableIngredients(List.of(1L, 2L, 3L)))
                .extracting(Recipe::getId)
                .contains(1L);
    }
}
