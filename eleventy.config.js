//import { IdAttributePlugin, InputPathToUrlTransformPlugin, HtmlBasePlugin } from "@11ty/eleventy";
//import { feedPlugin } from "@11ty/eleventy-plugin-rss";
//import pluginSyntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
//import pluginNavigation from "@11ty/eleventy-navigation";
//import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";

//import pluginFilters from "./_config/filters.js";

import pluginWebc from "@11ty/eleventy-plugin-webc";
import markdownIt from "markdown-it";

// We use this to render the Web Components from liquid templates
import { EleventyRenderPlugin } from "@11ty/eleventy";
function md_with_custom_webc() {
  // Override the default renderer rules to generate custom web components
  const renderer_overrides = {
    link_open: "link1",
    link_close: "link1",
    image: "image1",
  };

  const md = markdownIt({
    html: true,
  });

  Object.keys(renderer_overrides).forEach((rule) => {
    md.renderer.rules[rule] = function(tokens, idx, options, _env, self) {
      tokens[idx].tag = renderer_overrides[rule];
      return self.renderToken(tokens, idx, options);
    };
  });

  return md;
}


export default async function(eleventyConfig) {
  eleventyConfig.setLibrary("md", md_with_custom_webc());

  // Default layout 
  eleventyConfig.addGlobalData("layout", "layouts/base.webc");
  eleventyConfig.addGlobalData("run_mode", process.env.ELEVENTY_RUN_MODE);

  // Drafts, see also _data/eleventyDataSchema.js
  eleventyConfig.addPreprocessor("drafts", "*", (data, _content) => {
    if (data.draft && process.env.ELEVENTY_RUN_MODE === "build") {
      return false;
    }
  });

  // Copy the contents of the `public` folder to the output folder
  // For example, `./public/css/` ends up in `_site/css/`
  eleventyConfig
    .addPassthroughCopy({
      "./src/_includes/static/": "/"
    });
  eleventyConfig
    .addPassthroughCopy({
      "./src/_includes/css/": "/css"
    });

  // Relative paths on subpages (i.e. images inside the post)
  eleventyConfig.addPassthroughCopy("src/content/**/*.{svg,webp,png,jpg,jpeg,gif}", {
    mode: "html-relative"
  });
  eleventyConfig.setServerPassthroughCopyBehavior("passthrough");

  // Watch images for the image pipeline.
  eleventyConfig.addWatchTarget("src/**/*.{svg,webp,png,jpg,jpeg,gif}");

  // Add WebC plugin
  eleventyConfig.addPlugin(pluginWebc, {
    components: "src/_includes/components/**/*.webc"
  });

  eleventyConfig.addPlugin(EleventyRenderPlugin);

  //  // Per-page bundles, see https://github.com/11ty/eleventy-plugin-bundle
  //  // Adds the {% css %} paired shortcode
  //  eleventyConfig.addBundle("css", {
  //    toFileDirectory: "dist",
  //  });
  //  // Adds the {% js %} paired shortcode
  //  eleventyConfig.addBundle("js", {
  //    toFileDirectory: "dist",
  //  });
  //
  //  // Official plugins
  //  eleventyConfig.addPlugin(pluginSyntaxHighlight, {
  //    preAttributes: { tabindex: 0 }
  //  });
  //  eleventyConfig.addPlugin(pluginNavigation);
  //  eleventyConfig.addPlugin(HtmlBasePlugin);
  //  eleventyConfig.addPlugin(InputPathToUrlTransformPlugin);
  //
  //
  //  // Image optimization: https://www.11ty.dev/docs/plugins/image/#eleventy-transform
  //  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
  //    // Output formats for each image.
  //    formats: ["avif", "webp", "auto"],
  //
  //    // widths: ["auto"],
  //
  //    failOnError: false,
  //    htmlOptions: {
  //      imgAttributes: {
  //        // e.g. <img loading decoding> assigned on the HTML tag will override these values.
  //        loading: "lazy",
  //        decoding: "async",
  //      }
  //    },
  //
  //    sharpOptions: {
  //      animated: true,
  //    },
  //  });
  //
  //  // Filters
  //  eleventyConfig.addPlugin(pluginFilters);
  //
  //  eleventyConfig.addPlugin(IdAttributePlugin, {
  //    // by default we use Eleventy’s built-in `slugify` filter:
  //    // slugify: eleventyConfig.getFilter("slugify"),
  //    // selector: "h1,h2,h3,h4,h5,h6", // default
  //  });
  //
  //  eleventyConfig.addShortcode("currentBuildDate", () => {
  //    return (new Date()).toISOString();
  //  });
  //
  //  // Features to make your build faster (when you need them)
  //
  //  // If your passthrough copy gets heavy and cumbersome, add this line
  //  // to emulate the file copy on the dev server. Learn more:
  //  // https://www.11ty.dev/docs/copy/#emulate-passthrough-copy-during-serve
  //
};

export const config = {
  // Control which files Eleventy will process
  // e.g.: *.md, *.njk, *.html, *.liquid
  templateFormats: [
    "md",
    "njk",
    "html",
    "liquid",
    "11ty.js",
    "webc",
  ],

  // Pre-process *.md files with: (default: `liquid`)
  markdownTemplateEngine: "liquid",

  // Pre-process *.html files with: (default: `liquid`)
  // -- drusk: nothing. Source them from base.webc with @html - avoids reloading problems
  htmlTemplateEngine: "",

  // These are all optional:
  dir: {
    input: "src/content",          // default: "."
    includes: "../_includes",  // default: "_includes" (`input` relative)
    data: "../_data",          // default: "_data" (`input` relative)
    output: "./.site"
  },


};

