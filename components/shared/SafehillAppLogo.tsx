import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

const sizeVariants = cva('object-cover', {
  variants: {
    variant: {
      small: 'w-20',
      medium: 'w-40',
      large: 'w-80',
    },
  },
  defaultVariants: {
    variant: 'small',
  },
});

type SizeProps = React.ImgHTMLAttributes<HTMLImageElement> &
  VariantProps<typeof sizeVariants>;

const SafehillAppLogo = React.forwardRef<HTMLImageElement, SizeProps>(
  ({ className, variant, ...props }, _ref) => {
    const Comp = 'img';
    return (
      <div className="rounded-xl overflow-hidden shadow-lg">
        <Comp
          className={cn(sizeVariants({ variant }), className)}
          {...props}
          src="/images/safehill-app-logo-2.png"
          alt={`Image at /images/safehill-app-logo.png`}
        />
      </div>
    );
  }
);

SafehillAppLogo.displayName = 'SafehillAppLogo';

export default SafehillAppLogo;
