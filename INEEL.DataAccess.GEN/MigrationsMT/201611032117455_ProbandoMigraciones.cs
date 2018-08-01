namespace INEEL.DataAccess.GEN.MigrationsMT
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ProbandoMigraciones : DbMigration
    {
        public override void Up()
        {
            //DropForeignKey("MT.Capitulos", "EstadoCapituloId", "MT.cat_EstadoCapitulo");
            //DropIndex("MT.Capitulos", new[] { "EstadoCapituloId" });
            //RenameColumn(table: "MT.SoftwarePersonal", name: "Adjunto", newName: "CodigoFuente");
            //RenameIndex(table: "MT.SoftwarePersonal", name: "IX_Adjunto", newName: "IX_CodigoFuente");
            //AlterColumn("MT.Capitulos", "Year", c => c.DateTime());
            //DropColumn("MT.Capitulos", "EstadoCapituloId");
        }
        
        public override void Down()
        {
            //AddColumn("MT.Capitulos", "EstadoCapituloId", c => c.Int(nullable: false));
            //AlterColumn("MT.Capitulos", "Year", c => c.String(maxLength: 30));
            //RenameIndex(table: "MT.SoftwarePersonal", name: "IX_CodigoFuente", newName: "IX_Adjunto");
            //RenameColumn(table: "MT.SoftwarePersonal", name: "CodigoFuente", newName: "Adjunto");
            //CreateIndex("MT.Capitulos", "EstadoCapituloId");
            //AddForeignKey("MT.Capitulos", "EstadoCapituloId", "MT.cat_EstadoCapitulo", "EstadoCapituloId", cascadeDelete: true);
        }
    }
}
