﻿// <auto-generated />
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage;
using System;
using WebApplication2.Models;

namespace WebApplication2.Migrations.Status
{
    [DbContext(typeof(StatusContext))]
    partial class StatusContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.0.0-rtm-26452");

            modelBuilder.Entity("WebApplication2.Models.StatusItem", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<bool>("IsComplete");

                    b.Property<bool>("IsLoading");

                    b.Property<bool>("IsPending");

                    b.HasKey("Id");

                    b.ToTable("StatusItems");
                });
#pragma warning restore 612, 618
        }
    }
}
