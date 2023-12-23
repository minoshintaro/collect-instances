export default {
  build: {
    target: 'esnext',
    minify: true,
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
