namespace INEEL.DataAccess.GEN.MigrationsGI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class migdePIGI : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "GI.tab_TecnologiaLicenciadaPIDA",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        TecnologiaLicenciadaId = c.Int(nullable: false),
                        DerechosAutorId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("PI.tab_DerechosAutor", t => t.DerechosAutorId, cascadeDelete: true)
                .ForeignKey("GI.tab_TecnologiaLicenciada", t => t.TecnologiaLicenciadaId, cascadeDelete: true)
                .Index(t => t.TecnologiaLicenciadaId)
                .Index(t => t.DerechosAutorId);
            
            CreateTable(
                "GI.tab_TecnologiaLicenciadaPIPIndustrial",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        TecnologiaLicenciadaId = c.Int(nullable: false),
                        PropiedadIndustrialId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("PI.tab_PropiedadIndustrial", t => t.PropiedadIndustrialId, cascadeDelete: true)
                .ForeignKey("GI.tab_TecnologiaLicenciada", t => t.TecnologiaLicenciadaId, cascadeDelete: true)
                .Index(t => t.TecnologiaLicenciadaId)
                .Index(t => t.PropiedadIndustrialId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("GI.tab_TecnologiaLicenciadaPIPIndustrial", "TecnologiaLicenciadaId", "GI.tab_TecnologiaLicenciada");
            DropForeignKey("GI.tab_TecnologiaLicenciadaPIPIndustrial", "PropiedadIndustrialId", "PI.tab_PropiedadIndustrial");
            DropForeignKey("GI.tab_TecnologiaLicenciadaPIDA", "TecnologiaLicenciadaId", "GI.tab_TecnologiaLicenciada");
            DropForeignKey("GI.tab_TecnologiaLicenciadaPIDA", "DerechosAutorId", "PI.tab_DerechosAutor");
            DropIndex("GI.tab_TecnologiaLicenciadaPIPIndustrial", new[] { "PropiedadIndustrialId" });
            DropIndex("GI.tab_TecnologiaLicenciadaPIPIndustrial", new[] { "TecnologiaLicenciadaId" });
            DropIndex("GI.tab_TecnologiaLicenciadaPIDA", new[] { "DerechosAutorId" });
            DropIndex("GI.tab_TecnologiaLicenciadaPIDA", new[] { "TecnologiaLicenciadaId" });
            DropTable("GI.tab_TecnologiaLicenciadaPIPIndustrial");
            DropTable("GI.tab_TecnologiaLicenciadaPIDA");
        }
    }
}
