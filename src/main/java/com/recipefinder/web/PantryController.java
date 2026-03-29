package com.recipefinder.web;

import com.recipefinder.dto.IngredientDto;
import com.recipefinder.repository.IngredientRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@CrossOrigin(originPatterns = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class PantryController {

    private final IngredientRepository ingredientRepository;

    public PantryController(IngredientRepository ingredientRepository) {
        this.ingredientRepository = ingredientRepository;
    }

    @GetMapping
    public List<IngredientDto> getInventory() {
        return ingredientRepository.findAll().stream()
                .map(IngredientDto::fromEntity)
                .toList();
    }
}
