//
// Fast resampling by powers of two
//
// Copyright (C) 2016-2019 Andreas Gustafsson.  This file is part of
// the Gaborator library source distribution.  See the file LICENSE at
// the top level of the distribution for license information.
//

// Uses a two-lobe Lanczos kernel.  Good enough for image data, not
// intended for audio.

#ifndef _GABORATOR_RESAMPLE2_H
#define _GABORATOR_RESAMPLE2_H

#include <assert.h>
#include <inttypes.h>

#include <algorithm> // std::copy

#include "gaborator/pod_vector.h"

namespace gaborator {

//
// There are two ways to look at this.
//
// In one point of view, there is only one coordinate space, and
// coordinates are floating-point numbers.  The various sub- and
// supersampled views differ in step sizes and the number of
// fractional coordinate bits, but any given coordinates refer to the
// same point in the image at any scale.  Steps are powers of two,
// with integer exponents that may be negative.  A step size > 1
// implies downsampling (antialias lowpass filtering and subsampling),
// and a step size < 1 implies upsampling (aka interpolation).
//
// The coordinates are always integer multiples of the step size.
//
// e.g.,
//   x0 = 33.5, xstep = 0.5
//   x0 = 12, xstep = 4
//
// In the other point of view, we introduce an integer exponent e and
// substitute x0 = i0 * 2^e and xstep = 2^e.  Now instead of floating
// point coordinates, we use integer "indices".  The above example
// now looks like his:
//
//   i0 = 67, e = -1
//   i0 = 3, e = 2
//
// This latter point of view is how the code actually works.
//

// Resample data from "source", generating a view between indices
// i0 and i1 of the scale determined by exponent e, and storing
// i1 - i0 samples starting at *out.
//
// The source must implement an operator() taking the arguments
// (int64_t i0, int64_t i1, T *out) and generating data for the base
// resolution (e=0).
//
// S is the type of the data source
// T is the sample type

template <class S, class T>
T *resample2_ptr(const S &source, int64_t origin,
                 int64_t i0, int64_t i1, int e,
                 bool interpolate, T *out)
{
    assert(i1 >= i0);
    if (e > 0) {
        // Downsample
        // Calculate super-octave coordinates
        // margin is the support of the resampling kernel (on each side,
        // not counting the center sample)
        int margin = interpolate ? 1 : 0;
        // When margin = 1, we use three samples, at 2i-1, 2i, 2i+1
        // and the corresponding half-open inverval is 2i-1...2i+1+1
        int64_t si0 = 2 * i0 - margin;
        int64_t si1 = 2 * i1 + margin + 1;
        // Get super-octave data
        gaborator::pod_vector<T> super_data(si1 - si0);
        T *p = super_data.data();
        p = resample2_ptr(source, origin, si0, si1, e - 1, interpolate, p);
        assert(p == super_data.data() + si1 - si0);
        for (int64_t i = i0; i < i1; i++) {
            int64_t si = 2 * i - si0;
            T val;
            if (!interpolate) {
                // Point sampling
                val = super_data[si];
            } else {
                // Triangular kernel
                T v1 = super_data[si - 1];
                T v0 = super_data[si];
                v1 += super_data[si + 1];
                val =
                    v0 * (T)0.5 +
                    v1 * (T)0.25;
#if 0 // Lanczos2 is overkill when downsampling.
            } else {
                // Two-lobe Lanczos kernel, needs margin = 2
                // Always aligned
                T v3 = super_data[si - 3];
                // There is no v2
                T v1 = super_data[si - 1];
                T v0 = super_data[si];
                // There is still no v2
                v1 += super_data[si + 1];
                v3 += super_data[si + 3];
                val =
                    v0 * (T)0.49530706 +
                    v1 * (T)0.28388978 +
                    v3 * (T)-0.03154331;
#endif
            }
            *out++ = val;
        }
    } else if (e < 0) {
        // Upsample
        if (! interpolate) {
            // Return nearest neighbor.  If the pixel lies
            // exactly at the midpoint between the neighbors,
            // return their average.
            int sh = -e;
            int64_t si0 = i0 >> sh;
            int64_t si1 = ((i1 - 1) >> sh) + 1 + 1;
            gaborator::pod_vector<T> source_data(si1 - si0);
            source(origin + si0, origin + si1, source_data.data());
            for (int64_t i = i0; i < i1; i++) {
                int64_t si = (i >> sh) - si0;
                T val;
                int rem = i & ((1 << sh) - 1);
                int half = (1 << sh) >> 1;
                if (rem < half) {
                    val = source_data[si];
                } else if (rem == half) {
                    val = (source_data[si] + source_data[si + 1]) * (T)0.5;
                } else { // rem > half
                    val = source_data[si + 1];
                }
                *out++ = val;
            }
        } else {
            // Interpolate
            // Calculate sub-octave coordinates
            int margin = 2;
            int64_t si0 = (i0 >> 1) - margin;
            int64_t si1 = ((i1 - 1) >> 1) + margin + 1;
            // Get sub-octave data
            gaborator::pod_vector<T> sub_data(si1 - si0);
            T *p = sub_data.data();
            p = resample2_ptr(source, origin, si0, si1, e + 1, interpolate, p);
            assert(p == sub_data.data() + si1 - si0);
            for (int64_t i = i0; i < i1; i++) {
                int64_t si = (i >> 1) - si0;
                T val;
                if (i & 1) {
                    T v1 = sub_data[si - 1];
                    T v0 = sub_data[si];
                    v0 += sub_data[si + 1];
                    v1 += sub_data[si + 2];
                    val =
                        v0 * (T)0.5625 +
                        v1 * (T)-0.0625;
                } else {
                    val = sub_data[si];
                }
                *out++ = val;
            }
        }
    } else {
        // e == 0
        out = source(origin + i0, origin + i1, out);
    }
    return out;
}

// As above, but generating the output through an iterator
// rather than a pointer.
//
// S is the type of the data source
// OI is the output iterator type

template <class S, class OI>
OI resample2(const S &source, int64_t origin,
             int64_t i0, int64_t i1, int e,
             bool interpolate, OI out)
{
    typedef typename std::iterator_traits<OI>::value_type T;
    gaborator::pod_vector<T> data(i1 - i0);
    T *p = data.data();
    p = resample2_ptr(source, origin, i0, i1, e, interpolate, p);
    return std::copy(data.data(), data.data() + (i1 - i0), out);
}

// Calculate the range of source indices that will be accessed
// by a call to resample2(source, i0, i1, e) and return it
// through si0_ret and si1_ret.

// XXX this should take an "interpolate" argument so we don't
// return an unnecessarily large support when interpolation is off

inline void
resample2_support(int64_t origin, int64_t i0, int64_t i1, int e,
                  int64_t &si0_ret, int64_t &si1_ret)
{
    int margin = 2;
    if (e > 0) {
        // Note code duplication wrt resample2_ptr().
        // Also note tail recursion.
        int64_t si0 = i0 * 2 - margin + 1;
        int64_t si1 = i1 * 2 + margin;
        resample2_support(origin, si0, si1, e - 1, si0_ret, si1_ret);
    } else if (e < 0) {
        int64_t si0 = (i0 >> 1) - margin;
        int64_t si1 = ((i1 - 1) >> 1) + margin + 1;
        resample2_support(origin, si0, si1, e + 1, si0_ret, si1_ret);
    } else {
        si0_ret = origin + i0;
        si1_ret = origin + i1;
    }
}

// Inverse of the above, more or less: calculate the range of destination indices
// that depend on a given range of source indices.

inline void
resample2_inv_support(int64_t origin, int64_t si0, int64_t si1, int e,
                      int64_t &i0_ret, int64_t &i1_ret)
{
    // Conservative
    int margin = 2;
    if (e > 0) {
        int64_t di0, di1;
        resample2_inv_support(origin, si0, si1, e - 1, di0, di1);
        i0_ret = di0 >> 1;
        i1_ret = (di1 >> 1) + 1;
    } else if (e < 0) {
        int64_t di0, di1;
        resample2_inv_support(origin, si0, si1, e + 1, di0, di1);
        i0_ret = di0 * 2 - margin + 1;
        i1_ret = di1 * 2 + margin;
    } else {
        i0_ret = si0 - origin;
        i1_ret = si1 - origin;
    }
}

// Class wrappers for compatibility with other resamplers.

// Lanczos2 power-of-two resampler

template <class S, class OI>
struct lanczos2_pow2_resampler {
    lanczos2_pow2_resampler(int e_, int64_t origin_):
        e(e_), origin(origin_) { }
    OI resample(const S &source, int64_t i0, int64_t i1, OI out) const {
        return resample2(source, origin, i0, i1, e, true, out);
    }
    void support(int64_t i0, int64_t i1, int64_t &si0_ret, int64_t &si1_ret) const {
        return resample2_support(origin, i0, i1, e, si0_ret, si1_ret);
    }
    void inv_support(int64_t si0, int64_t si1, int64_t &i0_ret, int64_t &i1_ret) {
        return resample2_inv_support(origin, si0, si1, e, i0_ret, i1_ret);
    }
    int e;
    int64_t origin;
};

// Nearest-neighbor power-of-two resampler
// XXX simplify

template <class S, class OI>
struct nn_pow2_resampler {
    nn_pow2_resampler(int e_, int64_t origin_):
        e(e_), origin(origin_) { }
    OI resample(const S &source, int64_t i0, int64_t i1, OI out) const {
        return resample2(source, origin, i0, i1, e, false, out);
    }
    void support(int64_t i0, int64_t i1, int64_t &si0_ret, int64_t &si1_ret) const {
        return resample2_support(origin, i0, i1, e, si0_ret, si1_ret);
    }
    int e;
    int64_t origin;
};

} // namespace

#endif
