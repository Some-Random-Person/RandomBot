import { ConflictError, NotFoundError } from "../middleware/error.js";

class optionService {
  constructor(db) {
    this.option = db.Option;
  }

  async create(name) {
    const option = await this.option.findOne({
      where: { name },
    });

    if (option) {
      throw new ConflictError(`Option "${name}" already exists`);
    }

    const newOption = await this.option.create({ name });

    console.log(`Added option "${name}" to database`);
    return newOption;
  }

  async getOne(id) {
    const option = await this.option.findByPk(id);

    if (!option) {
      throw new NotFoundError(`Option "${id}" not found`);
    }

    return option;
  }

  async getAll() {
    const options = await this.option.findAll();

    if (options.length <= 0) {
      throw new NotFoundError(`No options found`);
    }

    return options;
  }

  async update(id, name) {
    const option = await this.option.findByPk(id);

    if (!option) {
      throw new NotFoundError(`Option "${id}" not found`);
    }

    const updatedOption = await option.update({ name });

    return updatedOption.get({ plain: true });
  }

  async delete(id) {
    const option = await this.option.findByPk(id);

    if (!option) {
      throw new NotFoundError(`Option "${id}" not found`);
    }

    await option.destroy();

    return option;
  }
}

export default optionService;
