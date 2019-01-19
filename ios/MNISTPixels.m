#include "MNISTPixels.h"
#import <React/RCTImageLoader.h>
#import "UIImage+ColorAtPixel.h"
#import <React/RCTLog.h>

@implementation MNISTPixels

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(getPixels:(NSString *)path
                  callback:(RCTResponseSenderBlock)callback)
{

  [_bridge.imageLoader loadImageWithURLRequest:[RCTConvert NSURLRequest:path] callback:^(NSError *error, UIImage *image) {
    if (error || image == nil) { // if couldn't load from bridge create a new UIImage
      if ([path hasPrefix:@"data:"] || [path hasPrefix:@"file:"]) {
        NSURL *imageUrl = [[NSURL alloc] initWithString:path];
        image = [UIImage imageWithData:[NSData dataWithContentsOfURL:imageUrl]];
      } else {
        image = [[UIImage alloc] initWithContentsOfFile:path];
      }

      if (image == nil) {
        callback(@[@"Could not create image from given path.", @""]);
        return;
      }
    }


    UIGraphicsBeginImageContextWithOptions(CGSizeMake(29, 29), YES, 0.0);
    [image drawInRect:CGRectMake(0, 0, 29, 29)];
    UIImage *newImage = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    // RCTLogInfo(@"Image width an height %f at %f", newImage.size.width, newImage.size.height);

    NSMutableArray *myArray = [NSMutableArray array];

    for(int i = 1; i <= 28; i++) {
      for(int j = 1; j <= 28; j++) {
        CGPoint point = CGPointMake(j, i);
        // RCTLogInfo(@"grabbing pixel at %d and %d", i, j);
        // Get color
        UIColor *pixelColor = [newImage colorAtPixel:point];
        // Get color components
        const CGFloat *components = CGColorGetComponents(pixelColor.CGColor);
        // Subtract green from red to get non-white
        CGFloat wanted = components[0] - components[1];
        // store Red floating point
        [myArray addObject:[NSNumber numberWithFloat:wanted]];
      }
    }
    callback(@[[NSNull null], myArray]);

  }];
}

@end
