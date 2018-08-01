namespace INEEL.DataAccess.GEN.MigrationsPI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AutoresPIPatrimonio : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "PI.tab_AutoresExtPIPatrimonio",
                c => new
                    {
                        AutoresExtPIPatrimonioId = c.Int(nullable: false, identity: true),
                        RequisicionesPIId = c.Int(nullable: false),
                        Nombre = c.String(),
                    })
                .PrimaryKey(t => t.AutoresExtPIPatrimonioId)
                .ForeignKey("PI.tab_RequisicionesPI", t => t.RequisicionesPIId, cascadeDelete: true)
                .Index(t => t.RequisicionesPIId);
            
            CreateTable(
                "PI.tab_RequisicionesPI",
                c => new
                    {
                        ClaveUnidad = c.String(maxLength: 10),
                        FechaEfectiva = c.DateTime(nullable: false),
                        RequisicionesPIId = c.Int(nullable: false, identity: true),
                        NumSolicitud = c.Int(nullable: false),
                        ClavePersona = c.String(),
                        TipoPIId = c.Int(nullable: false),
                        Titulo = c.String(),
                        NumSolicitudIMPI = c.String(),
                        NumTituloIMPI = c.String(),
                        FechaPresentacion = c.DateTime(),
                        FechaRecepcionTitulo = c.DateTime(),
                        FechaSolicitud = c.DateTime(),
                        FechaExamenFormaRecibido = c.DateTime(),
                        FechaExamenFondoRecibido = c.DateTime(),
                        FechaExpidicionTitulo = c.DateTime(),
                        DivicionId = c.String(),
                    })
                .PrimaryKey(t => t.RequisicionesPIId)
                .ForeignKey("PI.cat_TipoPI", t => t.TipoPIId, cascadeDelete: true)
                .ForeignKey("GEN.cat_UnidadOrganizacional", t => new { t.ClaveUnidad, t.FechaEfectiva })
                .Index(t => new { t.ClaveUnidad, t.FechaEfectiva })
                .Index(t => t.TipoPIId);
            
            //CreateTable(
            //    "GEN.cat_UnidadOrganizacional",
            //    c => new
            //        {
            //            ClaveUnidad = c.String(nullable: false, maxLength: 10),
            //            FechaEfectiva = c.DateTime(nullable: false),
            //            NombreUnidad = c.String(maxLength: 200),
            //            tipoO = c.Int(nullable: false),
            //            padre = c.String(),
            //            ClaveResponsable = c.String(),
            //            Localizacion = c.String(maxLength: 100),
            //            Estado = c.Int(nullable: false),
            //        })
            //    .PrimaryKey(t => new { t.ClaveUnidad, t.FechaEfectiva })
            //    .ForeignKey("GEN.cat_TipoUnidad", t => t.tipoO, cascadeDelete: true)
            //    .Index(t => t.tipoO);
            
            //CreateTable(
            //    "GEN.cat_TipoUnidad",
            //    c => new
            //        {
            //            TipoUnidadID = c.Int(nullable: false, identity: true),
            //            Descripcion = c.String(maxLength: 100),
            //            Estado = c.Int(nullable: false),
            //            FechaEfectiva = c.DateTime(nullable: false),
            //        })
            //    .PrimaryKey(t => t.TipoUnidadID);
            
            CreateTable(
                "PI.tab_AutoresIntPIPatrimonio",
                c => new
                    {
                        AutoresIntPIPatrimonioId = c.Int(nullable: false, identity: true),
                        RequisicionesPIId = c.Int(nullable: false),
                        ClavePersona = c.String(),
                    })
                .PrimaryKey(t => t.AutoresIntPIPatrimonioId)
                .ForeignKey("PI.tab_RequisicionesPI", t => t.RequisicionesPIId, cascadeDelete: true)
                .Index(t => t.RequisicionesPIId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("PI.tab_AutoresIntPIPatrimonio", "RequisicionesPIId", "PI.tab_RequisicionesPI");
            DropForeignKey("PI.tab_AutoresExtPIPatrimonio", "RequisicionesPIId", "PI.tab_RequisicionesPI");
            DropForeignKey("PI.tab_RequisicionesPI", new[] { "ClaveUnidad", "FechaEfectiva" }, "GEN.cat_UnidadOrganizacional");
            //DropForeignKey("GEN.cat_UnidadOrganizacional", "tipoO", "GEN.cat_TipoUnidad");
            DropForeignKey("PI.tab_RequisicionesPI", "TipoPIId", "PI.cat_TipoPI");
            DropIndex("PI.tab_AutoresIntPIPatrimonio", new[] { "RequisicionesPIId" });
            //DropIndex("GEN.cat_UnidadOrganizacional", new[] { "tipoO" });
            DropIndex("PI.tab_RequisicionesPI", new[] { "TipoPIId" });
            DropIndex("PI.tab_RequisicionesPI", new[] { "ClaveUnidad", "FechaEfectiva" });
            DropIndex("PI.tab_AutoresExtPIPatrimonio", new[] { "RequisicionesPIId" });
            DropTable("PI.tab_AutoresIntPIPatrimonio");
            //DropTable("GEN.cat_TipoUnidad");
            //DropTable("GEN.cat_UnidadOrganizacional");
            DropTable("PI.tab_RequisicionesPI");
            DropTable("PI.tab_AutoresExtPIPatrimonio");
        }
    }
}
