package com.recipefinder.web;

import com.recipefinder.dto.RecipeDto;
import com.recipefinder.service.RecipeService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/recipes")
@CrossOrigin(originPatterns = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class RecipeController {

    private final RecipeService recipeService;

    public RecipeController(RecipeService recipeService) {
        this.recipeService = recipeService;
    }

    @GetMapping("/suggested")
    public List<RecipeDto> getSuggestedRecipes() {
        return recipeService.getSuggestedRecipes().stream()
                .map(RecipeDto::fromEntity)
                .toList();
    }
}
