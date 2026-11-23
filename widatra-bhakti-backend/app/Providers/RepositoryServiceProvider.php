<?php

namespace App\Providers;

use App\Repositories\Contracts\ApplicationRepositoryInterface;
use App\Repositories\Contracts\ArticleRepositoryInterface;
use App\Repositories\Contracts\CommunityEventRepositoryInterface;
use App\Repositories\Contracts\ContactInquiryRepositoryInterface;
use App\Repositories\Contracts\CsrProgramRepositoryInterface;
use App\Repositories\Contracts\JobPostingRepositoryInterface;
use App\Repositories\Contracts\MediaAssetRepositoryInterface;
use App\Repositories\Contracts\ProductRepositoryInterface;
use App\Repositories\Contracts\TourBookingRepositoryInterface;
use App\Repositories\Eloquent\ApplicationRepository;
use App\Repositories\Eloquent\ArticleRepository;
use App\Repositories\Eloquent\CommunityEventRepository;
use App\Repositories\Eloquent\ContactInquiryRepository;
use App\Repositories\Eloquent\CsrProgramRepository;
use App\Repositories\Eloquent\JobPostingRepository;
use App\Repositories\Eloquent\MediaAssetRepository;
use App\Repositories\Eloquent\ProductRepository;
use App\Repositories\Eloquent\TourBookingRepository;
use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * Binds every repository interface used by the Service layer to its
     * Eloquent implementation. Swapping persistence later (e.g. for tests,
     * or a different data store) only means adding a new binding here.
     */
    public array $bindings = [
        JobPostingRepositoryInterface::class => JobPostingRepository::class,
        ApplicationRepositoryInterface::class => ApplicationRepository::class,
        TourBookingRepositoryInterface::class => TourBookingRepository::class,
        CommunityEventRepositoryInterface::class => CommunityEventRepository::class,
        ContactInquiryRepositoryInterface::class => ContactInquiryRepository::class,
        ArticleRepositoryInterface::class => ArticleRepository::class,
        ProductRepositoryInterface::class => ProductRepository::class,
        CsrProgramRepositoryInterface::class => CsrProgramRepository::class,
        MediaAssetRepositoryInterface::class => MediaAssetRepository::class,
    ];
}
