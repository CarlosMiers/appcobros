import { AnimationController } from '@ionic/angular';

export const fadeInAnimation = (animationCtrl: AnimationController, el: HTMLElement) => {
  return animationCtrl.create()
    .addElement(el)
    .duration(500)
    .fromTo('opacity', '0', '1')
    .fromTo('transform', 'translateY(20px)', 'translateY(0px)');
};