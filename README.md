# readme-contributors 🤖

> No, you don't need to install anything.

## Usage

```html
<img src="https://readme-contributors.now.sh/facebook/react?extension=jpg&width=300" />
```

```md
### Contributors

![Contributors](https://readme-contributors.now.sh/facebook/react?extension=jpg&width=300)
```

## API

**It only supports GitHub repositories.**

**It caches images for 7 days.**

### `https://readme-contributors.now.sh/:owner/:repo?args`

* #### `:owner` - The owner of the repo, it can be an organization as well.
* #### `:repo` - The repo's name

### Arguments

* #### `width` (number) - The width of the final image.
* #### `avatarSize = 30` (number) - The size of each avatar
* #### `avatarRadius = 50` (number) - The border radius amount of each avatar
* #### `spacing = 2` (number) - Padding between each avatar
* #### `theme = simple` (string) - The theme for your image, [available themes below](#themes).
* #### `aspectRatio = 2` (number) - Aspect ratio of the final image
* #### `quality = 100` (number) - The quality of the final image. Only for the `jpe?g` extension. `png` is always `100`.
* #### `count = 30` (number) - The amount of contributors. Maximum is `100`
* #### `:extension = jpeg` (string) - `jpg`, `jpeg` or `png`

### Themes

* #### `simple` (default)
* #### `dark`
* #### `unicorn` :unicorn:

## Examples

```md
![Contributors](https://readme-contributors.now.sh/facebook/react)
```
![Contributors](https://readme-contributors.now.sh/facebook/react)

```md
![Contributors](https://readme-contributors.now.sh/webpack/webpack?extension=jpg&width=300&count=10)
```
![Contributors](https://readme-contributors.now.sh/webpack/webpack?extension=jpg&width=300&count=10)

```md
![Contributors](https://readme-contributors.now.sh/chrislgarry/Apollo-11?extension=png&width=300&avatarSize=20&count=10)
```
![Contributors](https://readme-contributors.now.sh/chrislgarry/Apollo-11?extension=png&width=300&avatarSize=20&count=10)

```md
![Contributors](https://readme-contributors.now.sh/babel/babel?extension=png&width=300&spacing=10&count=10&theme=dark)
```
![Contributors](https://readme-contributors.now.sh/babel/babel?extension=png&width=300&spacing=10&count=10&theme=dark)

```md
![Contributors](https://readme-contributors.now.sh/zeit/next.js?width=300&theme=unicorn)
```
![Contributors](https://readme-contributors.now.sh/zeit/next.js?width=300&theme=unicorn)

```md
![Contributors](https://readme-contributors.now.sh/vuejs/vue?width=300&quality=50)
```
![Contributors](https://readme-contributors.now.sh/vuejs/vue?width=300&quality=50)

```md
![Contributors](https://readme-contributors.now.sh/prettier/prettier?width=300&aspectRatio=1)
```
![Contributors](https://readme-contributors.now.sh/prettier/prettier?width=300&aspectRatio=1)

```md
![Contributors](https://readme-contributors.now.sh/angular/angular?width=300&avatarRadius=0&spacing=0)
```
![Contributors](https://readme-contributors.now.sh/angular/angular?width=300&avatarRadius=0&spacing=0)


### Contributors

![Contributors](https://readme-contributors.now.sh/cezarsmpio/readme-contributors?extension=jpg&width=300)

---

Enjoy it!
