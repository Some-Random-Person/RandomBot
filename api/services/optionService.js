import { ConflictError, NotFoundError } from "../middleware/error.js";
import toPlain from "../utility/toPlain.js";

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
    return toPlain(newOption);
  }

  async getOne(id) {
    const option = await this.option.findByPk(id);

    if (!option) {
      throw new NotFoundError(`Option "${id}" not found`);
    }

    return toPlain(option);
  }

  async getAll() {
    const options = await this.option.findAll();

    if (options.length <= 0) {
      throw new NotFoundError(`No options found`);
    }

    return toPlain(options);
  }

  async update(id, name) {
    const otherOption = await this.option.findOne({
      where: { name },
    });

    if (otherOption) {
      throw new ConflictError(`Another option is already called "${name}"`);
    }

    const option = await this.option.findByPk(id);

    if (!option) {
      throw new NotFoundError(`Option "${id}" not found`);
    }

    const updatedOption = await option.update({ name });

    return toPlain(updatedOption);
  }

  async delete(id) {
    const option = await this.option.findByPk(id);

    if (!option) {
      throw new NotFoundError(`Option "${id}" not found`);
    }

    await option.destroy();

    return toPlain(option);
  }
}

export default optionService;
