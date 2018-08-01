namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class agregaComunidadExpertos : DbMigration
    {
        public override void Up()
        {
            CreateIndex("CR.cat_Expertos", "ComunidadId");
            AddForeignKey("CR.cat_Expertos", "ComunidadId", "CP.tab_Comunidades", "ComunidadId");
        }
        
        public override void Down()
        {
            DropForeignKey("CR.cat_Expertos", "ComunidadId", "CP.tab_Comunidades");
            DropForeignKey("CP.tab_Noticia", "idComunidad", "CP.tab_Comunidades");
            DropForeignKey("CP.tab_Metas", "idCP", "CP.tab_Comunidades");
            DropForeignKey("CP.tab_Lineamientos", "IdTipoLineamiento", "CP.cat_TipoLineamiento");
            DropForeignKey("CP.tab_Lineamientos", "idCP", "CP.tab_Comunidades");
            DropForeignKey("CP.tab_Lineamientos", "AdjuntoId", "GEN.Adjunto");
            DropForeignKey("CP.tab_Comunidades", "idCategoria", "CP.cat_CategoriaCP");
            DropForeignKey("CP.tab_Comunidades", "idAjunto", "GEN.Adjunto");
            DropIndex("CP.tab_Noticia", new[] { "idComunidad" });
            DropIndex("CP.tab_Metas", new[] { "idCP" });
            DropIndex("CP.tab_Lineamientos", new[] { "idCP" });
            DropIndex("CP.tab_Lineamientos", new[] { "IdTipoLineamiento" });
            DropIndex("CP.tab_Lineamientos", new[] { "AdjuntoId" });
            DropIndex("CP.tab_Comunidades", new[] { "idCategoria" });
            DropIndex("CP.tab_Comunidades", new[] { "idAjunto" });
            DropIndex("CR.cat_Expertos", new[] { "ComunidadId" });
            DropTable("CP.tab_Noticia");
            DropTable("CP.tab_Metas");
            DropTable("CP.cat_TipoLineamiento");
            DropTable("CP.tab_Lineamientos");
            DropTable("CP.cat_CategoriaCP");
            DropTable("CP.tab_Comunidades");
        }
    }
}
