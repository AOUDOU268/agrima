package com.agrima.delivery.repository;

import com.agrima.delivery.model.TourneeLivraison;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TourneeRepository extends JpaRepository<TourneeLivraison, Long> {
}
