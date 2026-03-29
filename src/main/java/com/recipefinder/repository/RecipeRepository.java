package com.recipefinder.repository;

import com.recipefinder.entity.Recipe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface RecipeRepository extends JpaRepository<Recipe, Long> {

    @Query("SELECT DISTINCT r FROM Recipe r JOIN FETCH r.ingredients")
    List<Recipe> findAllWithIngredients();
}
