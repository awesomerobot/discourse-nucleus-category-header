import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";

export default class NewCategoryHeader extends Component {
  @service router;
  @service site;

  // @tracked means the template will update when these values are updated
  @tracked category = null;
  @tracked categories = null;

  constructor() {
    super(...arguments);
    this.updateCategory(); // get category on init
    // get category on route change
    this.router.on("routeDidChange", this, this.updateCategory);
  }

  willDestroy() {
    super.willDestroy(...arguments);
    // stop watching for route changes on destroy
    this.router.off("routeDidChange", this, this.updateCategory);
  }

  get parentCategory() {
    // if category has a parent, return it, otherwise it is the parent itself
    return this.category?.parentCategory
      ? this.category.parentCategory
      : this.category;
  }

  get parentCategorySiblings() {
    // all the top-level categories without parents are siblings of each other
    return this.site.categories.filter((c) => !c.parent_category_id);
  }

  get subcategory() {
    // if the current category has a parent, it's a subcategory
    return this.category?.parentCategory ? this.category : null;
  }

  get subcategorySiblings() {
    // get the siblings of the current subcategory from its parent
    return this.category?.parentCategory?.subcategories;
  }

  @action
  updateCategory() {
    this.category = this.router.currentRoute.attributes?.category || null;
  }

  @action
  showDropdown(event) {
    // get all the category dropdowns
    let dropdowns = document.querySelectorAll(
      ".breadcrumb-dropdown-menu .category-dropdown"
    );

    dropdowns.forEach((dropdown) => {
      // if it isn't a child of the current target, remove the "show" class
      if (dropdown.parentNode != event.currentTarget) {
        dropdown.classList.remove("show");
      }
    });

    let dropdown = event.currentTarget.querySelector(".category-dropdown");
    if (dropdown) dropdown.classList.toggle("show");
  }

  @action
  hideDropdown(event) {
    let dropdown = event.currentTarget.querySelector(".category-dropdown");
    if (dropdown) dropdown.classList.remove("show");
  }
}
