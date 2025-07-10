// eslint-disable-next-line import/no-unresolved
import CartButton from "@/components/CartButton";
import Filter from "@/components/Filter";
import MenuCart from "@/components/MenuCart";
import SearchBar from "@/components/SearchBar";
import { images } from "@/constants";
import { getCategories, getMenu } from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwrite";
import { MenuItem } from "@/type";
import cn from "clsx";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { FlatList, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Search = () => {
  const { category, query } = useLocalSearchParams<{
    query: string;
    category: string;
  }>();
  const { data, refetch, loading } = useAppwrite({
    fn: getMenu,
    params: {
      category,
      query,
      limit: 6,
    },
  });

  const { data: categories } = useAppwrite({
    fn: getCategories,
  });

  useEffect(() => {
    refetch({
      category,
      query,
      limit: 6,
    });
  }, [category, query]);
  return (
    <SafeAreaView className='h-full bg-white'>
      <FlatList
        data={data}
        renderItem={({ item, index }) => {
          const isFirstRightColumn = index % 2 === 0;

          return (
            <View
              className={cn(
                "flex-1 max-w-[48%]",
                !isFirstRightColumn ? "mt-10" : "mt-0"
              )}
            >
              <MenuCart item={item as MenuItem} />
            </View>
          );
        }}
        keyExtractor={(item) => item.$id}
        numColumns={2}
        columnWrapperClassName='gap-7'
        contentContainerClassName='gap-7 px-5 pb-32'
        ListHeaderComponent={() => (
          <View className='my-7 gap-5'>
            <View className='flex-between flex-row w-full'>
              <View className='flex-start'>
                <Text className='small-bold uppercase text-primary'>
                  Search
                </Text>
                <View className='flex-center flex-row gap-x-2 mt-0.5'>
                  <Text className='paragraph-semibold text-dark-100'>
                    Find your Favorite Food
                  </Text>
                  <Image
                    source={images.arrowDown}
                    className='size-3'
                    resizeMode='contain'
                  />
                </View>
              </View>
              <CartButton />
            </View>
            <SearchBar />
            <Filter categories={categories!} />
          </View>
        )}
        ListEmptyComponent={() => !loading && <Text>No results</Text>}
      />
    </SafeAreaView>
  );
};

export default Search;
