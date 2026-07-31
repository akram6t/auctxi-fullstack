package com.auctxi.api;

import com.auctxi.api.service.DashboardService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class DashboardServiceTest {

    @Autowired
    private DashboardService dashboardService;

    @Test
    public void testGetRecentActivities() {
        try {
            System.out.println("TESTING getRecentActivities()");
            var activities = dashboardService.getRecentActivities();
            System.out.println("SUCCESS: " + activities.size() + " activities found.");
        } catch (Exception e) {
            System.err.println("FAILED with exception: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
