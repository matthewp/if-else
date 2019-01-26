# &lt;if-else&gt;

A __716 byte__ custom element to conditionally render a template.

```html
<if-else>
  <template slot="if">
    <div>Woo hoo!</div>
  </template>
</if-else>

<script type="module">
  import "https://unpkg.com/@matthewp/if-else/index.js";

  document.querySelector('if-else').value = true;

  // Content is now shown!
</script>
```

## Install

Install with [npm](https://www.npmjs.com/package/@matthewp/if-else)

```shell
npm install @matthewp/if-else
```

Or [Yarn](https://yarnpkg.com/en/package/@matthewp/if-else)

```shell
yarn add @matthewp/if-else
```

## Usage

`<if-else>` is an element. It has an attribute `true` that when set, shows the slot named `if`. This works like so:

```html
<if-else true>
  <template slot="if">This will be shown</template>
</if-else>
```

The children of `if-else` must be template elements.

If you would like to show an `else` condition provide a slot for `else`:


```html
<if-else>
  <template slot="if">This is NOT shown</template>
  <template slot="else">This is shown because no true attribute</template>
</if-else>
```

*Also* there is a `value` property. It is set to `true` when the condition is true and set to `false` when the condition is false.

Just remember:

* __true__: Renders the `if` slot.
* __false__: Renders the `else` slot.

## License

BSD-2-Clause