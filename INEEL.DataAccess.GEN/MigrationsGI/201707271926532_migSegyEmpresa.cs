namespace INEEL.DataAccess.GEN.MigrationsGI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class migSegyEmpresa : DbMigration
    {
        public override void Up()
        {
            CreateIndex("GI.tab_Propuesta", "EmpresaPromotorClave");
            CreateIndex("GI.tab_Propuesta", "SegmentoMercadoId");
            AddForeignKey("GI.tab_Propuesta", "EmpresaPromotorClave", "CR.cat_Empresas", "EmpresaId");
            AddForeignKey("GI.tab_Propuesta", "SegmentoMercadoId", "CR.cat_SegmentoMercado", "SegmentoMercadoId"); //cascadeDelete: true
        }
        
        public override void Down()
        {
            DropForeignKey("GI.tab_Propuesta", "SegmentoMercadoId", "CR.cat_SegmentoMercado");
            DropForeignKey("GI.tab_Propuesta", "EmpresaPromotorClave", "CR.cat_Empresas");
            DropIndex("GI.tab_Propuesta", new[] { "SegmentoMercadoId" });
            DropIndex("GI.tab_Propuesta", new[] { "EmpresaPromotorClave" });
        }
    }
}
