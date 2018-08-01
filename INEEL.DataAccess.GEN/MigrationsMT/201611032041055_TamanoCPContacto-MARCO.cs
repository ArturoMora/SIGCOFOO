namespace INEEL.DataAccess.GEN.MigrationsMT
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class TamanoCPContactoMARCO : DbMigration
    {
        public override void Up()
        {
            //RenameColumn(table: "MT.SoftwarePersonal", name: "CodigoFuente", newName: "Adjunto");
            //RenameIndex(table: "MT.SoftwarePersonal", name: "IX_CodigoFuente", newName: "IX_Adjunto");
            //AddColumn("MT.Capitulos", "EstadoCapituloId", c => c.Int(nullable: false));
            //AlterColumn("MT.Capitulos", "Year", c => c.String(maxLength: 30));
            //AlterColumn("CR.cat_Contactos", "CP", c => c.String(maxLength: 10));
            //CreateIndex("MT.Capitulos", "EstadoCapituloId");
            //AddForeignKey("MT.Capitulos", "EstadoCapituloId", "MT.cat_EstadoCapitulo", "EstadoCapituloId", cascadeDelete: true);
        }
        
        public override void Down()
        {
            //DropForeignKey("MT.Capitulos", "EstadoCapituloId", "MT.cat_EstadoCapitulo");
            //DropIndex("MT.Capitulos", new[] { "EstadoCapituloId" });
            //AlterColumn("CR.cat_Contactos", "CP", c => c.String(maxLength: 5));
            //AlterColumn("MT.Capitulos", "Year", c => c.DateTime());
            //DropColumn("MT.Capitulos", "EstadoCapituloId");
            //RenameIndex(table: "MT.SoftwarePersonal", name: "IX_Adjunto", newName: "IX_CodigoFuente");
            //RenameColumn(table: "MT.SoftwarePersonal", name: "Adjunto", newName: "CodigoFuente");
        }
    }
}
