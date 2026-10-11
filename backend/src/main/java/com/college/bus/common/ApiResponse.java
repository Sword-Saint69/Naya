package com.college.bus.common;

public record ApiResponse<T>(boolean ok, T data, String error) {
  public static <T> ApiResponse<T> ok(T data) { return new ApiResponse<>(true, data, null); }
  public static <T> ApiResponse<T> fail(String error) { return new ApiResponse<>(false, null, error); }
}
