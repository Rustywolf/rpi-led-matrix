#include <napi.h>
#include <led-matrix.h>
#include "napi-utils.cc"

using namespace rgb_matrix;
/**
 *  RGBMatrix::Options led_options;
 *	rgb_matrix::RuntimeOptions runtime;
 *
 *	// Set defaults
 *	led_options.chain_length = 3;
 *	led_options.show_refresh_rate = true;
 *	runtime.drop_privileges = 1;
 *	if (!rgb_matrix::ParseOptionsFromFlags(&argc, &argv, &led_options, &runtime)) {
 *	  rgb_matrix::PrintMatrixFlags(stderr);
 *	  return 1;
 *	}
 *
 *  RGBMatrix *matrix = CreateMatrixFromOptions(led_options, runtime);
 *	if (matrix == NULL) {
 *    return 1;
 *  }
 *	delete matrix;   // Make sure to delete it in the end to switch off LEDs.
 */

RGBMatrix::Options createMatrixOptions(const Napi::CallbackInfo& info) {
	auto env = info.Env();

	if (!info[0].IsObject()) throw Napi::Error::New(env, "The second argument of the SPI transfer method must be a config object!");

	auto jsOpts = info[0].As<Napi::Object>();

	RGBMatrix::Options options = RGBMatrix::Options();
	options.brightness = NapiUtils::getProp(env, jsOpts, "brightness").As<Napi::Number>();
	options.chain_length = NapiUtils::getProp(env, jsOpts, "chain_length").As<Napi::Number>();
	options.cols = NapiUtils::getProp(env, jsOpts, "cols").As<Napi::Number>();
	options.multiplexing = NapiUtils::getProp(env, jsOpts, "multiplexing").As<Napi::Number>();
	options.parallel = NapiUtils::getProp(env, jsOpts, "parallel").As<Napi::Number>();
	options.pwm_bits = NapiUtils::getProp(env, jsOpts, "pwm_bits").As<Napi::Number>();
	options.pwm_dither_bits = NapiUtils::getProp(env, jsOpts, "pwm_dither_bits").As<Napi::Number>();
	options.pwm_lsb_nanoseconds = NapiUtils::getProp(env, jsOpts, "pwm_lsb_nanoseconds").As<Napi::Number>();
	options.row_address_type = NapiUtils::getProp(env, jsOpts, "row_address_type").As<Napi::Number>();
	options.rows = NapiUtils::getProp(env, jsOpts, "rows").As<Napi::Number>();
	options.scan_mode = NapiUtils::getProp(env, jsOpts, "scan_mode").As<Napi::Number>();
	options.disable_hardware_pulsing = NapiUtils::getProp(env, jsOpts, "disable_hardware_pulsing").As<Napi::Boolean>();
	options.inverse_colors = NapiUtils::getProp(env, jsOpts, "inverse_colors").As<Napi::Boolean>();
	options.show_refresh_rate = NapiUtils::getProp(env, jsOpts, "show_refresh_rate").As<Napi::Boolean>();

	return options;
}

Napi::Boolean validateOptions(const Napi::CallbackInfo& info) {
	auto options = createMatrixOptions(info);
	auto env = info.Env();
	return Napi::Boolean::New(env, options.Validate(NULL));
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    // Napi::Object modes = Napi::Object::New(env);
	exports.Set("validateOptions", Napi::Function::New(env, validateOptions));
    return exports;
}

NODE_API_MODULE(spi, Init)
