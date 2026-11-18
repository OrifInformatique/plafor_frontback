package ch.sectioninformatique.template.auth;

import lombok.Builder;

@Builder
public record AuthCodeDto(
    Long id,
    String code
) {}
