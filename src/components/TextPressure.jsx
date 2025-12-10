// Component ported from https://codepen.io/JuanFuentes/full/rgXKGQ

import { useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

const TextPressure = ({
  text = 'Compressa',
  fontFamily = 'Compressa VF',
  // This font is just an example, you should not use it in commercial projects.
  fontUrl = 'https://res.cloudinary.com/dr6lvwubh/raw/upload/v1529908256/CompressaPRO-GX.woff2',

  width = true,
  weight = true,
  italic = true,
  alpha = false,

  flex = true,
  stroke = false,
  scale = false,

  textColor = '#FFFFFF',
  strokeColor = '#FF0000',
  strokeWidth = 2,
  className = '',

  minFontSize = 24,
  direction = 'auto',
  lang
}) => {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const spansRef = useRef([]);

  const mouseRef = useRef({ x: 0, y: 0 });
  const cursorRef = useRef({ x: 0, y: 0 });

  const [fontSize, setFontSize] = useState(minFontSize);
  const [scaleY, setScaleY] = useState(1);
  const [lineHeight, setLineHeight] = useState(1);

  const isRtlText = useMemo(() => {
    const rtlRegex = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/;
    return rtlRegex.test(text);
  }, [text]);

  const computedDir =
    direction === 'rtl' || (direction === 'auto' && isRtlText) ? 'rtl' : 'ltr';
  const uppercaseAllowed = computedDir === 'ltr';
  const usePerChar = computedDir === 'ltr';

  const segments = useMemo(() => {
    if (!usePerChar) return [text];
    if (typeof Intl !== 'undefined' && Intl.Segmenter) {
      const segmenter = new Intl.Segmenter(
        computedDir === 'rtl' ? 'ar' : 'en',
        { granularity: 'grapheme' }
      );
      return Array.from(segmenter.segment(text), item => item.segment);
    }
    return Array.from(text);
  }, [computedDir, text, usePerChar]);

  const dist = (a, b) => {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  useEffect(() => {
    const handleMouseMove = e => {
      cursorRef.current.x = e.clientX;
      cursorRef.current.y = e.clientY;
    };
    const handleTouchMove = e => {
      const t = e.touches[0];
      cursorRef.current.x = t.clientX;
      cursorRef.current.y = t.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    if (containerRef.current) {
      const { left, top, width, height } = containerRef.current.getBoundingClientRect();
      mouseRef.current.x = left + width / 2;
      mouseRef.current.y = top + height / 2;
      cursorRef.current.x = mouseRef.current.x;
      cursorRef.current.y = mouseRef.current.y;
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  const setSize = () => {
    if (!containerRef.current || !titleRef.current) return;

    const { width: containerW, height: containerH } = containerRef.current.getBoundingClientRect();

    const baseUnits = usePerChar ? segments.length : Math.max(text.length, 8);
    let newFontSize = containerW / (baseUnits / 2);
    newFontSize = Math.max(newFontSize, minFontSize);

    setFontSize(newFontSize);
    setScaleY(1);
    setLineHeight(1);

    requestAnimationFrame(() => {
      if (!titleRef.current) return;
      const textRect = titleRef.current.getBoundingClientRect();

      if (scale && textRect.height > 0) {
        const yRatio = containerH / textRect.height;
        setScaleY(yRatio);
        setLineHeight(yRatio);
      }
    });
  };

  useEffect(() => {
    setSize();
    window.addEventListener('resize', setSize);
    return () => window.removeEventListener('resize', setSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scale, segments.length, usePerChar, text.length]);

  useEffect(() => {
    let rafId;
    const animate = () => {
      mouseRef.current.x += (cursorRef.current.x - mouseRef.current.x) / 15;
      mouseRef.current.y += (cursorRef.current.y - mouseRef.current.y) / 15;

      if (titleRef.current) {
        const titleRect = titleRef.current.getBoundingClientRect();
        const maxDist = titleRect.width / 2;

        spansRef.current.forEach(span => {
          if (!span) return;

          const rect = span.getBoundingClientRect();
          const charCenter = {
            x: rect.x + rect.width / 2,
            y: rect.y + rect.height / 2
          };

          const d = dist(mouseRef.current, charCenter);

          if (usePerChar) {
            const getAttr = (distance, minVal, maxVal) => {
              const val = maxVal - Math.abs((maxVal * distance) / maxDist);
              return Math.max(minVal, val + minVal);
            };

            const wdth = width ? Math.floor(getAttr(d, 5, 200)) : 100;
            const wght = weight ? Math.floor(getAttr(d, 100, 900)) : 400;
            const italVal = italic ? getAttr(d, 0, 1).toFixed(2) : 0;
            const alphaVal = alpha ? getAttr(d, 0, 1).toFixed(2) : 1;

            span.style.opacity = alphaVal;
            span.style.fontVariationSettings = `'wght' ${wght}, 'wdth' ${wdth}, 'ital' ${italVal}`;
          } else {
            span.style.opacity = 1;
            span.style.fontVariationSettings = '';
          }
        });
      }

      rafId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(rafId);
  }, [width, weight, italic, alpha, segments.length, usePerChar]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-transparent">
      <style>{`
        @font-face {
          font-family: '${fontFamily}';
          src: url('${fontUrl}');
          font-style: normal;
        }
        .stroke span {
          position: relative;
          color: ${textColor};
        }
        .stroke span::after {
          content: attr(data-char);
          position: absolute;
          left: 0;
          top: 0;
          color: transparent;
          z-index: -1;
          -webkit-text-stroke-width: ${strokeWidth}px;
          -webkit-text-stroke-color: ${strokeColor};
        }
      `}</style>
      <h1
        ref={titleRef}
        dir={computedDir}
        lang={lang || (computedDir === 'rtl' ? 'ar' : undefined)}
        className={cn(
          'text-pressure-title text-center',
          className,
          flex && usePerChar && 'flex justify-between',
          stroke && 'stroke',
          uppercaseAllowed && 'uppercase'
        )}
        style={{
          fontFamily,
          fontSize: fontSize,
          lineHeight,
          transform: `scale(1, ${scaleY})`,
          transformOrigin: 'center top',
          margin: 0,
          fontWeight: 100,
          color: stroke ? undefined : textColor,
          direction: computedDir
        }}>
        {segments.map((char, i) => (
          <span
            key={i}
            ref={el => (spansRef.current[i] = el)}
            data-char={char}
            className="inline-block"
            style={{ unicodeBidi: 'isolate', display: usePerChar ? 'inline-block' : 'inline' }}>
            {char}
          </span>
        ))}
      </h1>
    </div>
  );
};

export default TextPressure;
