import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface CustomHeaderProps {
    centerNode: {
        title: string,
        node?: React.ReactNode
    },
    leftNode: React.ReactNode,
    rightNode: React.ReactNode
}

const CustomHeader: React.FC<CustomHeaderProps> = ({centerNode, leftNode, rightNode}) => {
    return (
    <View style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <View style={styles.sideContent}>
          {leftNode} 
        </View>
        
        <View>
            <Text style={styles.title}>
                {centerNode.title}
            </Text>

            {centerNode.node && (
                    <View style={styles.headerContainer}>
                        {centerNode.node}
                    </View>
                )}
        </View>
        
        <View style={styles.sideContent}>
          {rightNode}
        </View>
      </View>
    </View>
    );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#491414ff', 
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#b5b5b5ff',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 50, 
    paddingHorizontal: 15,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#333',
    flexShrink: 1, 
    textAlign: 'center',
  },
  sideContent: {
    width: 60, 
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
});

export default CustomHeader;