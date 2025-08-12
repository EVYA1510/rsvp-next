import "@testing-library/jest-dom";

// Mock Next.js router
jest.mock("next/router", () => ({
  useRouter() {
    return {
      route: "/",
      pathname: "/",
      query: {},
      asPath: "/",
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
      isFallback: false,
    };
  },
}));

// Mock Next.js navigation
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  usePathname() {
    return "/";
  },
}));

// Mock Framer Motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
    span: ({ children, ...props }) => <span {...props}>{children}</span>,
    p: ({ children, ...props }) => <p {...props}>{children}</p>,
    h1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
    h2: ({ children, ...props }) => <h2 {...props}>{children}</h2>,
    h3: ({ children, ...props }) => <h3 {...props}>{children}</h3>,
    img: ({ ...props }) => <img {...props} />,
    form: ({ children, ...props }) => <form {...props}>{children}</form>,
    input: ({ ...props }) => <input {...props} />,
    textarea: ({ children, ...props }) => (
      <textarea {...props}>{children}</textarea>
    ),
    select: ({ children, ...props }) => <select {...props}>{children}</select>,
    option: ({ children, ...props }) => <option {...props}>{children}</option>,
    label: ({ children, ...props }) => <label {...props}>{children}</label>,
    a: ({ children, ...props }) => <a {...props}>{children}</a>,
    main: ({ children, ...props }) => <main {...props}>{children}</main>,
    section: ({ children, ...props }) => (
      <section {...props}>{children}</section>
    ),
    article: ({ children, ...props }) => (
      <article {...props}>{children}</article>
    ),
    nav: ({ children, ...props }) => <nav {...props}>{children}</nav>,
    header: ({ children, ...props }) => <header {...props}>{children}</header>,
    footer: ({ children, ...props }) => <footer {...props}>{children}</footer>,
    aside: ({ children, ...props }) => <aside {...props}>{children}</aside>,
    ul: ({ children, ...props }) => <ul {...props}>{children}</ul>,
    ol: ({ children, ...props }) => <ol {...props}>{children}</ol>,
    li: ({ children, ...props }) => <li {...props}>{children}</li>,
    table: ({ children, ...props }) => <table {...props}>{children}</table>,
    thead: ({ children, ...props }) => <thead {...props}>{children}</thead>,
    tbody: ({ children, ...props }) => <tbody {...props}>{children}</tbody>,
    tr: ({ children, ...props }) => <tr {...props}>{children}</tr>,
    th: ({ children, ...props }) => <th {...props}>{children}</th>,
    td: ({ children, ...props }) => <td {...props}>{children}</td>,
  },
  AnimatePresence: ({ children }) => children,
}));

// Mock react-hot-toast
jest.mock("react-hot-toast", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    loading: jest.fn(),
  },
  Toaster: () => null,
}));

// Mock fetch
global.fetch = jest.fn().mockImplementation(() => {
  return Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({ success: true }),
    text: () => Promise.resolve("OK"),
    headers: {
      entries: () => [["content-type", "application/json"]],
      get: (name) => {
        const headers = {
          "content-type": "application/json",
          "access-control-allow-origin": "*",
        };
        return headers[name.toLowerCase()];
      },
    },
  });
});

// Mock Request and Response for API testing
global.Request = class Request {
  constructor(url, options = {}) {
    this.url = url;
    this.method = options.method || "GET";
    this.headers = new Map();
    this.body = options.body;

    // Parse URL parameters
    const urlObj = new URL(url);
    this.searchParams = urlObj.searchParams;
  }

  text() {
    return Promise.resolve(this.body || "");
  }

  json() {
    return Promise.resolve(JSON.parse(this.body || "{}"));
  }
};

global.Response = class Response {
  constructor(body, options = {}) {
    this.body = body;
    this.status = options.status || 200;
    this.statusText = options.statusText || "OK";
    this._headers = new Map();

    if (options.headers) {
      Object.entries(options.headers).forEach(([key, value]) => {
        this._headers.set(key, value);
      });
    }
  }

  text() {
    return Promise.resolve(this.body || "");
  }

  json() {
    return Promise.resolve(
      typeof this.body === "string" ? JSON.parse(this.body) : this.body
    );
  }

  get headers() {
    return {
      get: (name) => this._headers.get(name),
      set: (name, value) => this._headers.set(name, value),
      entries: () => Array.from(this._headers.entries()),
      has: (name) => this._headers.has(name),
      append: (name, value) => this._headers.set(name, value),
      forEach: (callback) => this._headers.forEach(callback),
      keys: () => this._headers.keys(),
      values: () => this._headers.values(),
      [Symbol.iterator]: () => this._headers.entries(),
      raw: () => Object.fromEntries(this._headers),
      getAll: (name) => [this._headers.get(name)].filter(Boolean),
      delete: (name) => this._headers.delete(name),
      toString: () => "Headers",
      constructor: { name: "Headers" },
      [Symbol.toStringTag]: "Headers",
      name: "Headers",
      length: this._headers.size,
      [Symbol.toPrimitive]: () => "[object Headers]",
      valueOf: () => "[object Headers]",
      toJSON: () => Object.fromEntries(this._headers),
      inspect: () => "[object Headers]",
      [Symbol.for("nodejs.util.inspect.custom")]: () => "[object Headers]",
      [Symbol.for("jest-symbol-do-not-touch")]: () => "[object Headers]",
    };
  }
};

// Mock NextResponse
global.NextResponse = class NextResponse extends global.Response {
  constructor(body, options = {}) {
    // Create a proper Response with headers
    const response = new global.Response(body, {
      status: options.status || 200,
      headers: options.headers || {},
    });
    
    // Copy all properties from the response
    Object.setPrototypeOf(response, NextResponse.prototype);
    return response;
  }
};

// Add static json method to NextResponse
global.NextResponse.json = function(data, options = {}) {
  const response = new global.Response(JSON.stringify(data), {
    status: options.status || 200,
    headers: {
      "content-type": "application/json",
      ...options.headers,
    },
  });
  
  // Copy all properties from the response
  Object.setPrototypeOf(response, global.NextResponse.prototype);
  return response;
};

// Mock NextRequest
global.NextRequest = global.Request;

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};
