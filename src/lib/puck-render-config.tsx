/**
 * Puck 렌더 전용 config — backoffice config.tsx 의 render 부분과 동일.
 * 스타일 필드(글꼴, 색상, 여백, 둥글기 등)를 모두 반영한다.
 */

const THEME = {
  font: "'Pretendard', -apple-system, sans-serif",
  ink: "#111827",
  ink2: "#6b7280",
};

export const puckRenderConfig = {
  components: {
    Heading: {
      render: ({
        text, level, align, fontFamily, fontSize, color,
        backgroundColor, paddingY, paddingX, borderRadius,
      }: {
        text: string; level: "h1" | "h2" | "h3"; align: string;
        fontFamily?: string; fontSize?: number; color?: string;
        backgroundColor?: string; paddingY?: number; paddingX?: number; borderRadius?: number;
      }) => {
        const Tag = level;
        return (
          <Tag
            style={{
              fontFamily: fontFamily || THEME.font,
              fontSize: fontSize || 28,
              fontWeight: 700,
              color: color || THEME.ink,
              textAlign: align as "left" | "center" | "right",
              lineHeight: 1.4,
              margin: 0,
              padding: `${paddingY ?? 12}px ${paddingX ?? 0}px`,
              backgroundColor: backgroundColor || "transparent",
              borderRadius: borderRadius ?? 0,
            }}
          >
            {text}
          </Tag>
        );
      },
    },

    Text: {
      render: ({
        content, align, fontFamily, fontSize, color,
        backgroundColor, paddingY, paddingX, borderRadius,
      }: {
        content: string; align: string;
        fontFamily?: string; fontSize?: number; color?: string;
        backgroundColor?: string; paddingY?: number; paddingX?: number; borderRadius?: number;
      }) => (
        <p
          style={{
            fontFamily: fontFamily || THEME.font,
            fontSize: fontSize || 16,
            lineHeight: 1.8,
            color: color || THEME.ink2,
            textAlign: align as "left" | "center" | "right",
            margin: 0,
            padding: `${paddingY ?? 12}px ${paddingX ?? 0}px`,
            whiteSpace: "pre-wrap",
            backgroundColor: backgroundColor || "transparent",
            borderRadius: borderRadius ?? 0,
          }}
        >
          {content}
        </p>
      ),
    },

    Image: {
      render: ({
        src, alt, maxWidth, borderRadius, paddingY, backgroundColor,
      }: {
        src: string; alt: string; maxWidth: number;
        borderRadius?: number; paddingY?: number; backgroundColor?: string;
      }) =>
        src ? (
          <div
            style={{
              padding: `${paddingY ?? 24}px 0`,
              textAlign: "center",
              backgroundColor: backgroundColor || "transparent",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt}
              style={{
                maxWidth: `${maxWidth}px`,
                width: "100%",
                height: "auto",
                borderRadius: borderRadius ?? 8,
              }}
            />
          </div>
        ) : null,
    },

    ImageText: {
      render: ({
        src, alt, text, imagePosition, fontFamily, fontSize, color,
        gap, backgroundColor, paddingY, paddingX, borderRadius,
      }: {
        src: string; alt: string; text: string; imagePosition: string;
        fontFamily?: string; fontSize?: number; color?: string;
        gap?: number; backgroundColor?: string;
        paddingY?: number; paddingX?: number; borderRadius?: number;
      }) => (
        <div
          style={{
            display: "flex",
            flexDirection: imagePosition === "right" ? "row-reverse" : "row",
            gap: gap ?? 32,
            alignItems: "center",
            padding: `${paddingY ?? 24}px ${paddingX ?? 0}px`,
            backgroundColor: backgroundColor || "transparent",
            borderRadius: borderRadius ?? 0,
          }}
        >
          <div style={{ flex: "0 0 45%" }}>
            {src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={src}
                alt={alt}
                style={{ width: "100%", height: "auto", borderRadius: 8 }}
              />
            ) : null}
          </div>
          <div style={{ flex: 1 }}>
            <p
              style={{
                fontFamily: fontFamily || THEME.font,
                fontSize: fontSize || 16,
                lineHeight: 1.8,
                color: color || THEME.ink2,
                whiteSpace: "pre-wrap",
                margin: 0,
              }}
            >
              {text}
            </p>
          </div>
        </div>
      ),
    },
  },
};
