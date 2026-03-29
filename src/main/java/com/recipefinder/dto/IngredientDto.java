package com.recipefinder.dto;

import com.recipefinder.entity.Ingredient;

import java.time.LocalDate;

public record IngredientDto(
        Long id,
        String name,
        String category,
        Double quantity,
        String unit,
        LocalDate expiryDate
) {
    public static IngredientDto fromEntity(Ingredient entity) {
        return new IngredientDto(
                entity.getId(),
                entity.getName(),
                entity.getCategory().name(),
                entity.getQuantity(),
                entity.getUnit(),
                entity.getExpiryDate()
        );
    }
}
