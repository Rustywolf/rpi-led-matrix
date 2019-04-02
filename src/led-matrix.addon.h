#ifndef NODELEDMATRIX_H
#define NODELEDMATRIX_H

#include "font.addon.h"
#include "image.h"
#include <graphics.h>
#include <iostream>
#include <led-matrix.h>
#include <assert.h>
#include <napi.h>

using namespace rgb_matrix;

class LedMatrixAddon : public Napi::ObjectWrap<LedMatrixAddon> {
  public:
	static Napi::Object Init(Napi::Env env, Napi::Object exports);
	LedMatrixAddon(const Napi::CallbackInfo& info);
	~LedMatrixAddon();

	Napi::Value bg_color(const Napi::CallbackInfo& info);
	Napi::Value brightness(const Napi::CallbackInfo& info);
	Napi::Value clear(const Napi::CallbackInfo& info);
	Napi::Value draw_buffer(const Napi::CallbackInfo& info);
	Napi::Value draw_circle(const Napi::CallbackInfo& info);
	Napi::Value draw_line(const Napi::CallbackInfo& info);
	Napi::Value draw_rect(const Napi::CallbackInfo& info);
	Napi::Value draw_text(const Napi::CallbackInfo& info);
	Napi::Value fg_color(const Napi::CallbackInfo& info);
	Napi::Value fill(const Napi::CallbackInfo& info);
	Napi::Value font(const Napi::CallbackInfo& info);
	Napi::Value height(const Napi::CallbackInfo& info);
	Napi::Value luminance_correct(const Napi::CallbackInfo& info);
	Napi::Value pwm_bits(const Napi::CallbackInfo& info);
	Napi::Value set_pixel(const Napi::CallbackInfo& info);
	Napi::Value width(const Napi::CallbackInfo& info);

	Napi::Value sync(const Napi::CallbackInfo& info);

	static Napi::Value default_matrix_options(const Napi::CallbackInfo& info);
	static Napi::Value default_runtime_options(const Napi::CallbackInfo& info);

  private:
	static Color color_from_callback_info(const Napi::CallbackInfo& info);
	static Napi::Object obj_from_color(const Napi::Env& env, const Color&);
	static Napi::FunctionReference constructor;
	static Napi::Object matrix_options_to_obj(const Napi::Env& env, const RGBMatrix::Options& options);
	static Napi::Object runtime_options_to_obj(const Napi::Env& env, const RuntimeOptions& options);
	static RGBMatrix::Options create_matrix_options(const Napi::Env& env, const Napi::Object& obj);
	static RuntimeOptions create_runtime_options(const Napi::Env& env, const Napi::Object& obj);

	Color fg_color_;
	Color bg_color_;
	Font* font_;
	std::string font_name_;
	RGBMatrix* matrix_;
	FrameCanvas* canvas_;
};

#endif