/* eslint-disable @typescript-eslint/no-var-requires */
import faker from 'faker'
import Movie from './models/Movie'

const seedData = async () => {
  try {
    const movies = []
    const numberOfMovies = 5
    for (let i = 0; i <= numberOfMovies; i++) {
      movies.push(
        new Movie({
          name: faker.name.firstName(),
          publishedYear: faker.date.past(),
          duration: faker.time.recent(),
        })
      )
    }
    console.log(movies)
  } catch (error) {
    console.log(error)
  }
}
seedData()
