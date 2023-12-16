export default {
  build: {
    target: 'esnext',
    minify: false,
    rollupOptions: {
      input: {
        main: './src/code.ts'
      },
      output: {
        entryFileNames: 'code.js'
      }
    }
  }
}
