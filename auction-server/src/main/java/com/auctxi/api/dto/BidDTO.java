package com.auctxi.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BidDTO {
    private Long teamId;
    private String teamName;
    private Double amount;
    private Date timestamp;
}
